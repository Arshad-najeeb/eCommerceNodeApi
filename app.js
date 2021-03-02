var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/project4", function (err, database) {
    const db = database.db('project4')
    db.collection('product', function (err, collection) {
        collection.insert({ id: 1, description: 'Product1', image: 'image1.jpg',pricing:'2399.00',shippingcost:'15.00',Title:'Product1' });
        collection.insert({ id: 2, description: 'Product2', image: 'image2.jpg',pricing:'1199.00',shippingcost:'15.00',Title:'Product2' });
        collection.insert({ id: 3, description: 'Product3', image: 'image3.jpg',pricing:'1800.00',shippingcost:'15.00',Title:'Product3' });
        collection.insert({ id: 4, description: 'Procuct4', image: 'image4',pricing:'1099.00',shippingcost:'15.00',Title:'Product4' });

        collection.insert({ id: 5, description: 'Product5', image: 'image5.jpg',pricing:'656.00',shippingcost:'15.00',Title:'Product5' });
        collection.insert({ id: 6, description: 'Product6', image: 'image6.jpg',pricing:'888.00',shippingcost:'15.00',Title:'Product6' });
        collection.insert({ id: 7, description: 'Product7', image: 'image7.jpg',pricing:'1999.00',shippingcost:'15.00',Title:'product7' });
        collection.insert({ id: 8, description: 'Product8', image: 'image8.jpg',pricing:'999.00',shippingcost:'15.00',Title:'Product8' });
        db.collection('product').count(function (err, count) {
            if (err) throw err;
            console.log('Total Rows: ' + count);
        }); 
    });
   
                
});
