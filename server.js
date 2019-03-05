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
  let phone
  let email
  let title
  let expiration
  let contractNum
  let contactsName
  let contractForms
  let vendorContract = []
  let vendorContractJSON = {}
  //initiate cheerio using $ variable
  let $ = cheerio.load(res.data)

  //Grab elements from the page and save to variables by looping through each child element in parent element
  $(".vendor-contract-header__container").children(".row").children(".col-xs-12 col-sm-8").each((element)=>{
    //save HTML data to variables
    title = $(element).children("p.lead").text()
    expiration = $(element).children("p").text()
    contractNum = $(element).children("p").text()
    vendorName = $(element).children(".vendor-contract-header_content").find("h1").text()
  })

      //grab elements
      $("field field--name-field-contract-documents field--type-file field--label-above").each((element)=>{
        //save to variable
        contractForms = $(element).children(".field--item").children("span.file-link").find("a").attr("href")
      })

        //variables

        // get the data
        $(".contract-marketing full clearfix vendor-contract").each((element)=> {
          // save to variable
          contactsName = $(".div.inline-user").children("div.inline-user").children("div").text()
          phone = $(".div.inline-user").children("div.inline-user").children("div").text()
          email = $(".div.inline-user").children("div.inline-user").children("div").text()


          //push data to empty array assigned above
        }) // ends .each

        vendorContract.push({
          title: title
          // expiration: expiration,
          // contract_number: contractNum,
          // files: [
            //   {
              //     contractforms: contractForms
              //   }
              // ],
              // vendor: {
                //   name: vendorName,
                //   contacts: [
                  //     {
                    //       name: contactsName,
                    //       phone: phone,
                    //       email: email
                    //     }
                    //   ]
                    // }
                  }) // ends push
        //Convert data to JSON object
        vendorContractJSON = JSON.stringify(vendorContract, null, 4)

        console.log(vendorContract);


}) //closes first scrape
