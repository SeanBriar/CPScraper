const cheerio = require("cheerio")
const axios = require("axios")

// JSON Skeleton:
//title = .vendor-contract-header_content > p.lead
//expiration (Maturity Date) = .vendor-contract-header_content > p
//contract number  = .vendor-contract-header_content > p
//files - array [ (**second scrape for this info**)
  // {
  // contract-forms = span.file-link > a attr.href
  //   }
// ]
//vender {
  // name = .vendor-contract-header_content > h1.h2
  // contacts - array [ (**third scrape for this info**)
  // {
    // name = article.vendor-contract > div.inline-user > div
    // phone = article.vendor-contract > div.inline-user > div
    // email = article.vendor-contract > div.inline-user > div
    // }
  // ]
//   }
// }

//Make a request via axios to query the HTML elements from the website
//  * First scrape *
axios.get("https://www.sourcewell-mn.gov/cooperative-purchasing/022217-wex").then((res)=> {
  //variables
  let title
  let expiration
  let contractNum
  let vendorContract = []
  let vendorContractJSON = {}
  //initiate cheerio using $ variable
  let $ = cheerio.load(res.data)

  //Grab elements from the page and save to variables by looping through each child element in parent element
  $("col-xs-12 col-sm-8").each((element)=>{
    //save HTML data to variables
    title = $(element).children(".vendor-contract-header_content").children("p").find(".lead").text()
    expiration = $(element).children("p").text()
    contractNum = $(element).children("p").text()
    vendorName = $(element).children(".vendor-contract-header_content").find("h1").text()
  })


  // * Second scrape *
  axios.get("https://www.sourcewell-mn.gov/cooperative-purchasing/022217-wex#tab-contract-documents").then((res)=>{
    //variables for this scrape
    let contractForms
    //redefine $ for new page/data
      let $ = cheerio.load(res.data)

      //grab elements
      $("field field--name-field-contract-documents field--type-file field--label-above").each((element)=>{
        //save to variable
        contractForms = $(element).children(".field--item").children("span.file-link").find("a").attr("href")
      })


      // * third scrape *
      axios.get("https://www.sourcewell-mn.gov/cooperative-purchasing/022217-wex#tab-contact-information").then((res)=>{
        //variables
        let contactsName
        let phone
        let email
        //redefine $ for new page/data
        let $ = cheerio.load(res.data)

        // get the data
        $(".contract-marketing full clearfix vendor-contract").each((element)=> {
          // save to variable
          contactsName = $(".div.inline-user").children("div.inline-user").children("div").text()
          phone = $(".div.inline-user").children("div.inline-user").children("div").text()
          email = $(".div.inline-user").children("div.inline-user").children("div").text()


          //push data to empty array assigned above
          vendorContract.push({
            title: title,
            expiration: expiration,
            contract_number: contractNum,
            files: [
              {
                contractforms: contractForms
              }
            ],
            vendor: {
              name: vendorName,
              contacts: [
                {
                  name: contactsName,
                  phone: phone,
                  email: email
                }
              ]
            }
          }) // ends push
        }) // ends .each

        //Convert data to JSON object
        vendorContractJSON = JSON.stringify(vendorContract, null, 4)

        console.log(vendorContractJSON);
      }) // closes third scrape

  }) //closes second scrape

}) //closes first scrape


//Challenges:
  // It seems like nesting axios requests is a bad idea, but I was having issues with scope and combining all the data into one JSON object.
  // Also, gathering the data from the 'contacts' site was a bit tricky because of the class and elements used to build the site - there wasn't much individuality between each piece of data.
