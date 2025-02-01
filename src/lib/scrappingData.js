const axios = require('axios');
const cheerio = require('cheerio');

// URL of the product page (this is a placeholder URL)
const productURL = 'https://www.amazon.in/s?i=fashion&bbn=99977378031&rh=n%3A6648217031%2Cn%3A99977378031%2Cn%3A7459781031%2Cn%3A1968024031%2Cp_85%3A10440599031&s=nbi&dc&ds=v1%3ADoeYEhPTgkRMXH0cejYByopaGMabrFGOZCZ4Si1STbk&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=7aec54e5-0aa2-4b6a-8aff-a0c6dbd42b2d&pf_rd_r=6MY1WP7EM9HM9V1AKGDY&pf_rd_s=merchandised-search-13&qid=1719566154&rnid=10440598031&ref=sr_nr_p_85_1'
const url = new URL(productURL);;

export const scrapeProductData= async  ()=> {
  try {
    // Fetch the HTML from the page
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract data (This is just an example. You need to inspect the page to target the correct elements)
    const productTitle = $('h1.product-title').text().trim();
    const productPrice = $('span.price').text().trim();
    const productDescription = $('div.product-description').text().trim();
    
    // Build the result object
    const productData = {
      title: productTitle,
      price: productPrice,
      description: productDescription,
    };

    // Output the result as JSON
    console.log(JSON.stringify(productData, null, 2));
  } catch (error) {
    console.error('Error fetching the data:', error);
  }
}

