# Flixr 

Flixr is a movie search engine powered by user responses to a simple multiple-choice quizlet.

## Index:

- [Scope](#Scope)
- [User Stories](#user-stories)
- [Wireframes](#wireframes)
- [Data Models](#data-models)
- [Milestones](#milestones)

## Scope

Flixr makes use of The Movie Database API

##### Technologies in play

- ReactJs
  - axios
  - bootstrap
  - router-dom
- NodeJs
  - bcrypt
  - body parser
  - cors
  - dotenv
  - express/sessions
  - mongoDB
  - mongoose

## User Stories

A Gizmo user is anyone who wants to buy or sell a good, it can be used or new.

#### Non-authenticated Users can:

- View landing page
- View all items for sale
- Filter/search items for sale\*
- Sign Up to Gizmo
- Log in their Gizmo account

#### Authenticated users can

- View landing page
- View all items for sale
- Filter/search items for sale\*
- View their profile page
- View their orders
- View items they sell
- Create posts for selling items (with image\*)
- Delete posts for items they sell
- Edit posts for items they sell
- Leave reviews for items they have bought\*
- Update their profile image\*

## Wireframes

### Landing

Users will see a slogan, some descriptive info of the site and the latest added items.

![image](https://i.imgur.com/51qy8VK.png)

### Profile

Users will see their profile information and a path to post and item or view the items they offer.

![image](https://i.imgur.com/Rg5i3dJ.png)

### Buy / Sell

This will be the same view for Buy/Sell _with the exception_ that when users are viewing the items they sell, they will be able to see a button to edit or delete the post.

![image](https://i.imgur.com/ANPX2rC.png)

### Product Detail/ Edit product

This view will allow users to closely examine a product they are interested in or edit one of the product they offer. Reviews for products are part of stretch goals.

![image](https://i.imgur.com/OjTqG0p.png)

### Shopping Cart Flow

This will take our user through the payment portal through the cart, shipping and payment forms.

View 1
![image](https://i.imgur.com/oW4au4Z.png)

View 2
![image](https://i.imgur.com/WYZphwp.png)

View 3
![image](https://i.imgur.com/0mbyC5O.png)

## Data Models

### Users

- userId
- name
- lastName
- email
- password
- img
- address

### Products

- productId
- userId
- title
- description
- category
- price
- image
- qty

### Orders

- orderId
- userdId
- [productIds]
- shipInfo
- payInfo
- total
- status

### Reviews \*

- \_id
- userId
- productId
- rating
- title
- description

## Milestones

#### Sprint 1 - March 8

- Users can see a Nav/Footer through the page
- Users can see a landing page
- Users can sign-up or log-in
- Users can see their profile page
- Users can update their profile info
- Users can add an img-url for their profile picture

#### Sprint 2 (Full CRUD & _MVP_) - March 9

- Users can create a post to sell
- Users can add an img-url to their selling-items
- Users can see "localhost:4000/shop" to see all items on sale
- Users can see "localhost:4000/myshop" to see items they sell
- Within "/myshop"
  - Users can delete their posts
  - Users can edit their posts

#### Sprint 3 - March 10

- Users can add items to their shopping cart
- Users can see the total amount to pay
- Users can input shipping info
- Users can input billing info
- Users can create an order
- Users can view their orders in "/myorders"

#### Sprint 4 / Bonuses - March 11

- Users can search/filter "/shop"
- Users can upload their own profile picture
- Users can upload their own product picture
- Stripe Payment integrations
- Users can create reviews
- Users receive purchase notifications
- Users can msg the seller about products