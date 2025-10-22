# web103_unit4_project# WEB103 Project 4 - *DIY Delight*

Submitted by: **Ricardo Ortega-Pacheco**

About this web app: **Create your own dream car. This project is a focus on build and backend API with Node.js + Express, implemented to a database (PostgreSQL) using Render as the host. The Frontend is with React that gets the API from the backend service.**

Time spent: **12** hours

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->
- [x] **The web app uses React to display data from the API.**
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured `CustomItem` table.**
  - [x]  **NOTE: Your walkthrough added to the README must include a view of your Render dashboard demonstrating that your Postgres database is available**
  - [x]  **NOTE: Your walkthrough added to the README must include a demonstration of your table contents. Use the psql command 'SELECT * FROM tablename;' to display your table contents.**
- [x] **Users can view **multiple** features of the `CustomItem` (e.g. car) they can customize, (e.g. wheels, exterior, etc.)**
- [x] **Each customizable feature has multiple options to choose from (e.g. exterior could be red, blue, black, etc.)**
- [x] **On selecting each option, the displayed visual icon for the `CustomItem` updates to match the option the user chose.**
- [] **The price of the `CustomItem` (e.g. car) changes dynamically as different options are selected *OR* The app displays the total price of all features.**
- [x] **The visual interface changes in response to at least one customizable feature.**
- [x] **The user can submit their choices to save the item to the list of created `CustomItem`s.**
- [x] **If a user submits a feature combo that is impossible, they should receive an appropriate error message and the item should not be saved to the database.**
- [x] **Users can view a list of all submitted `CustomItem`s.**
- [x] **Users can edit a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [x] **Users can delete a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [x] **Users can update or delete `CustomItem`s that have been created from the detail page.**


The following **optional** features are implemented:

- [x] Selecting particular options prevents incompatible options from being selected even before form submission

## Video Walkthrough

Here's a walkthrough of implemented required features:
### Create 
<img src='https://i.imgur.com/32w09PK.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

### CRUD

<img src='https://i.imgur.com/gAis3iv.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

### PSQL
<img src="https://i.imgur.com/xdUzTbR.gif" title="PQSL" atl="Video">
<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...  CAPLice

## Notes

Describe any challenges encountered while building the app or any additional context you'd like to add.

- Using mutliple tables and connecting them together with PostgreSQL, table custom_items is has a PK/FK with custom_item_features that displays the options the custom items has using the id as the primary key
- It has been a while using frontend development with React, api callings, useState, and so on. Changes was that I set names with the tables that were joinned and gave me a troble identifying it. 

