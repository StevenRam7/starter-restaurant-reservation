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

![capstone-create-res](https://user-images.githubusercontent.com/83251605/148873951-7fb221b1-df0f-48b2-9c61-9c191bd7d8d2.png)

![capstone-edit-res](https://user-images.githubusercontent.com/83251605/148873963-c59b898b-b30e-4b13-9d1b-c68b782ce8b5.png)

![capstone-seat](https://user-images.githubusercontent.com/83251605/148873975-c0c819be-07e3-4c27-936c-772d2428e365.png)

![capstone-create-table](https://user-images.githubusercontent.com/83251605/148873979-d8fd40fa-9992-448c-b3b4-da6743610e99.png)

![capstone-search](https://user-images.githubusercontent.com/83251605/148873988-079d9232-99b7-42cb-8bef-5f8d7996c6b9.png)