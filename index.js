const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const Rooms = [{
    roomId: '001',
    roomName: 'Elite',
    seats : '1000',
    price : '150000',
    amenites : ['wifi', 'AC', 'Flat TV screen', ' 24-hour front desk'],  
},
{
    roomId: '002',
    roomName: 'Premium',
    seats : '500',
    price : '100000',
    amenites : ['wifi', 'AC', 'TV', 'projection screen'],
},
{
    roomId: '001',
    roomName: 'Basic',
    seats : '500',
    price : '75000',
    amenites : ['wifi', 'AC', 'TV'],
}
]

const bookingDetails = [{
    CustName : 'kumar',
    roomName : 'Premium',
    roomId: '002',
    date : new Date('25-12-2022'),
    startTime: '18:00',
    endTime: '21:00',
    status :'booked',
},
{
    CustName : 'kathir',
    roomName : 'basic',
    roomId: '003',
    date : new Date('26-12-2022'),
    startTime: '14:00',
    endTime: '20:00',
    status :'booked',  
}
]

//Home page
app.get('/',(req,res)=>{
    res.send("Hall booking App Home Page!!");
});

//create a new room
app.post('/room/create',(req,res)=>{
    // res.send("Room page");
    let id = Rooms.length + 1;
    req.body.roomId = id;
    Rooms.push({
    roomName: req.body.roomName,
    roomId: req.body.roomId,
    seats: req.body.seats,    
    price: req.body.price,
    amenities: req.body.amenities,
  });
  res.status(201).json(`The id ${id} with room is created successfully`);
})


//booking a room
app.post('/room/book',(req,res) =>{
    // res.send("book Page");
    let id = bookingDetails.length + 1;
    req.body.roomId = id;
    try {
      req.body.date = new Date(req.body.date);
      let booking_detail = {
        CustName: req.body.CustName,
        roomId: req.body.roomId,
        roomName: req.body.roomName,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        status: 'booked',
      };
      let result = undefined;
      for (const book of bookingDetails) {
        if (
          book.date.getTime() == req.body.date.getTime() &&
          book.startTime === req.body.startTime
        ) {
          console.log(book.date.getTime(), req.body.date.getTime());
          result = 0;
          console.log('in booking');
          return res
            .status(400)
            .send({ error: 'The room is not available with this time slot' });
        } else {
          result = 1;
          bookingDetails.push(booking_detail);
          return res
            .status(201)
            .send(
              `Room is successfully booked with the id ${req.body.booked_room_id}`
            );
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).send('internal error');
    }
});

// List all rooms with booked data
app.get('/room/booked-details', (req, res) => {
    // res.send('booked-details');
    let roomArray = [];
  
    bookingDetails.forEach((customer) => {
      let roomdet = {};
  
      roomdet.roomName = customer.roomName;
      roomdet.status = customer.status;
      roomdet.CustName = customer.CustName;
      roomdet.date = customer.date;
      roomdet.startTime = customer.startTime;
      roomdet.endTime = customer.endTime;
      roomArray.push(roomdet);
    });  
    res.status(200).send(roomArray);
  });
  
  
// List all customers with booked data

app.get('/room/customer-details', (req, res) => {
    let customerArray = [];

bookingDetails.forEach((customer) => {
    let customerObj = {};
    customerObj.CustName = customer.CustName;
    customerObj.roomName = customer.roomName;
    customerObj.date = customer.date;
    customerObj.startTime = customer.startTime;
    customerObj.endTime = customer.endTime;
    customerArray.push(customerObj);
});
  
    res.status(200).send(customerArray);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT , () => {
    console.log(`server running on port ${PORT}`);            
});