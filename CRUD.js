  const { MongoClient } = require('mongodb');

  const uri = "mongodb+srv://admin:adminpassword@cluster0.1gxonjs.mongodb.net/test";  // user: admin pass: adminpassword
  const client = new MongoClient(uri);
  const faker = require('faker');                                                   // using faker.js to create random data inputs


  // CREATING 
  async function insertCustomers (numCustomers) {                              
    try {
      const db = client.db('myNewDatabase');
      const collection = db.collection('customerDetails');
      
      for (let i = 0; i < numCustomers; i++) {                          // create (numCustomers) amount of customer data
        const title = faker.name.prefix();                              // Create random details for customer
        const firstName = faker.name.firstName();
        const surname = faker.name.lastName();                          
        const mobile = faker.phone.phoneNumberFormat();
        const email = faker.internet.email();
        const homeAddress = {
          addressLine1: faker.address.streetAddress(),
          addressLine2: faker.address.secondaryAddress(),
          town: faker.address.city(),
          county: faker.address.county(),
          eircode: faker.address.zipCode()
        };
        const shippingAddress = {
          addressLine1: faker.address.streetAddress(),
          addressLine2: faker.address.secondaryAddress(),
          town: faker.address.city(),
          county: faker.address.county(),
          eircode: faker.address.zipCode()
        };
        
        const result = await collection.insertMany([{                       // Add randomised data to a customer
          title,
          firstName,
          surname,
          mobile,
          email,
          homeAddress,
          shippingAddress
        }]);
      }
      console.log(`Successfully created ${numCustomers} random customers`);                     // Print to terminal

    } catch (error) {
      console.error('Error creating customers collection:', error);
    }
  }

  async function insertPhones() {                                                   // Create phone stock data 
    try {
      const db = client.db('myNewDatabase');
      const collection = db.collection('phoneDetails');

      const result = await collection.insertMany([
        {manufacturer: "Apple", model: "iPhone 12", price: "600", quantity: Math.floor(Math.random() * 5) + 1},                 // Phone manufacturer,model,price and randomised quantity as customers can get more than one item
        {manufacturer: "Apple", model: "iPhone 14", price: "900", quantity: Math.floor(Math.random() * 5) + 1},
        {manufacturer: "Apple", model: "iPhone 14 Pro", price: "1400", quantity: Math.floor(Math.random() * 5) + 1},
        {manufacturer: "Samsung", model: "Samsung 21 FE", price: "799", quantity: Math.floor(Math.random() * 5) + 1},
        {manufacturer: "Oppo", model: "Reno 8", price: "495", quantity: Math.floor(Math.random() * 5) + 1},
        {manufacturer: "Samsung", model: "A14", price: "210", quantity: Math.floor(Math.random() * 5) + 1},
        {manufacturer: "Apple", model: "iPhone 14 Pro Max", price: "1800", quantity: Math.floor(Math.random() * 5) + 1}
    ]);
    console.log(`Successfully created 7 phone details`);
  
    } catch (error) {
      console.error('Error creating new database:', error);
    }
  }


/**
 * Created an orderFaker function, in order to combine details from specific customers (randomised) and the phone they have purchased (randomised).
 */
  function orderFaker(numOrders, customers, phones) {                      
    const orders = [];
    for (let i = 0; i < numOrders; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];     // Randomly Select a customer out of 10, "Math.floor" used to insure index is within bounds of array
      const numPhones = Math.floor(Math.random() * 3) + 1;                          // Randomly select if customer has more than 1 phone model ordered
      const phoneOrder = [];

      for (let j = 0; j < numPhones; j++) {
        const phone = phones[Math.floor(Math.random() * phones.length)];           // Randomly Select a phone out of 7, "Math.floor" used to insure index is within bounds of array
        phoneOrder.push(phone);                                                    // Add phone onto 'phoneOrder' array 
      }

      const order = {
        customer: customer,
        phone: phoneOrder,
        orderDate: faker.date.past(),
      };
      orders.push(order);                                                       // Add new order to array 
    }
    return orders;                                                              // Return finished array 
  }

  /**  */
  async function insertOrders(numOrders, customers, phones) {
    try {
      const db = client.db('myNewDatabase');
      const collection = db.collection('orders');
  

      const orders = orderFaker(numOrders, customers, phones);                  // Call orderFaker function
  

      for (const order of orders) {                                             // iterate through orders and insert into collection
        const result = await collection.insertOne(order);
      }
      console.log(`Successfully created ${numOrders} orders`);
  
    } catch (error) {
      console.error('Error creating orders collection:', error);
    }
  }
  

  // Retrieving Random Customer 

  async function findCustomer() {
    const db = client.db('myNewDatabase');
    const collection = db.collection('customerDetails');

    const customer = await collection.findOne({});                          // Randomised find
    return console.log(customer);
  }

  // Updating Random Customer

  async function updateCustomer() {
    const db = client.db('myNewDatabase');
    const collection = db.collection('customerDetails');

    const customer = await collection.findOne({});                                      // Find random customer

    const newEmail = faker.internet.email();                                            // Update email,phone,title,homeAddress,shippingAddress
    const newPhone = faker.phone.phoneNumberFormat();
    const newTitle = faker.name.prefix();
    const newHomeAddress = {
        addressLine1: faker.address.streetAddress(),
        addressLine2: faker.address.secondaryAddress(),
        town: faker.address.city(),
        county: faker.address.county(),
        eircode: faker.address.zipCode()
      };
      const newShippingAddress = {
        addressLine1: faker.address.streetAddress(),
        addressLine2: faker.address.secondaryAddress(),
        town: faker.address.city(),
        county: faker.address.county(),
        eircode: faker.address.zipCode()
      };

    const id = { _id: customer._id};                            // id of customer in collection

    const update = {
        $set: {                                                 // update new
          email: newEmail,
          mobile: newPhone,
          title: newTitle,
          homeAddress: newHomeAddress,
          shippingAddress: newShippingAddress
        }
      };

      console.log("Customer information updated");
  }

  // Deleting Customer
  const deleteCustomer = async function() {
    try {
      const db = client.db('myNewDatabase');
      const collection = db.collection('customerDetails');

      await client.withSession(async (session) => {                         // create new session, end when complete/errors
        await collection.deleteOne(
          { firstName: "Damon", surName: "Stracke", mobile: "828-631-1484", email: "Patience84@hotmail.com"},       // chosen data to remove
          { session }                                                       // pause session object 
        );
        console.log("Removed the document with email: 'Patience84@hotmail.com");
      });
    } catch (error) {
      console.log("Error deleting document:", error);
    } finally {
      await client.close();
    }
  };
  

  async function main() {
    await client.connect();
    const db = client.db('myNewDatabase');
    
    const customersCollection = db.collection('customerDetails');
    const phonesCollection = db.collection('phoneDetails');
  
    await insertCustomers(10);             // create customer
    await insertPhones();                  // create phone 
  
    const customers = await customersCollection.find().toArray();               // Retrieve all customers from collection
    const phones = await phonesCollection.find().toArray();                         // Retrieve all phones from collection
    await insertOrders(5, customers, phones);                                   // using customers,phones just created
                                            // create order

    await findCustomer();                   // retrieve customer
    await updateCustomer();                 // update customer
    await deleteCustomer();                 // delete customer

    await client.close();
  }
  
  main();


/** Database Design
 * I used a normalised data design for my database, using this data design it prevents
 * data inconsistencies. It was alot easier to manage all of the tables and the relationships 
 * between them e.g Orders -> Customer, Phone collections. Working with a sized database, using 
 * a denormalised data design would have allowed me to speed up data retrieval, which in turn is benefecial for 
 * large databases.
 */