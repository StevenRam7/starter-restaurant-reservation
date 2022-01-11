# Thinkful Final Capstone: Restaurant Reservation System

Deployed Application: 

## Summary
This is a full-stack web application created as a final capstone project for Thinkful's software engineering course.

The application allows users to create, edit, and cancel restaurant reservations as well as add new tables to the system, seat reservations to tables, and clear tables when service is complete. Users may also search for reservations using the customer's phone number. Restrictions are included so that only valid reservations are accepted (e.g. during working hours).

## Technology Used

* JavaScript
* React
* Node
* Express
* PostgreSQL
* CSS
* HTML

## Installation Instructions

* In the project root directory install dependencies using 'npm install'
* To run the application using a localhost use 'npm run start:dev'

## API Documentation

| Route       | HTTP Method      | Status Code | Description   |
| :---        |    :----:   |     :----:   |        ---:  |
| /reservations      | GET   | 200  | Returns a list of reservations for the current date |
| /reservations      | POST  | 201    | Creates a new reservation |
| /reservations?date=YYYY-MM-DD      | GET |  200    | Returns a list of reservations for the selected date |
| /reservations/:reservation_id      | GET  | 200     | Returns the reservation for the selected ID |
| /reservations/:reservation_id      | PUT  | 200     | Updates the reservation for the selected ID |
| /reservations/:reservation_id/status      | PUT  | 200     | Updates the status of the reservation for the selected ID |
| /tables   | GET  | 200      | Returns a list of tables     |
| /tables   | POST  | 201      | Creates a new table     |
| /tables/:table_id/seat   | PUT | 200      | Seats a reservation at the selected table     |
| /tables/:table_id/seat   | DELETE  | 200      | Changes status to "unoccupied" for the selected table     |

 ## Reservation Sample Data
 ```json
"data": {
    "reservation_id": 25,
    "first_name": "Rick",
    "last_name": "Sanchez",
    "mobile_number": "202-555-0164",
    "reservation_date": "2020-12-31",
    "reservation_time": "20:00:00",
    "people": 6,
    "status": "booked",
    "created_at": "2020-12-10T08:30:32.326Z",
    "updated_at": "2020-12-10T08:30:32.326Z"
  },
```

## Table Sample Data
 ```json
{
      "table_id": 2,
      "table_name": "#2",
      "capacity": 6,
      "reservation_id": 24
    }
```

## Screenshots

![capstone-dashboard](https://user-images.githubusercontent.com/83251605/148873922-a13dfc85-c5b7-4e6e-befa-6a7aa523bca6.png)

![capstone-create-res](https://user-images.githubusercontent.com/83251605/148874843-73345299-8f79-4e07-9aff-305d25139e07.png)

![capstone-edit-res](https://user-images.githubusercontent.com/83251605/148874863-14a0bad2-b6fd-40b6-8519-a162f11ff177.png)

![capstone-seat](https://user-images.githubusercontent.com/83251605/148875189-d4ed7c20-df1a-4b97-a43e-6af86f3a94c4.png)

![capstone-create-table](https://user-images.githubusercontent.com/83251605/148874878-a30e59bb-17fb-4b7f-aad5-919828fba84b.png)

![capstone-search](https://user-images.githubusercontent.com/83251605/148874880-2e8903d0-6a00-4047-83d5-b24d8ebada42.png)