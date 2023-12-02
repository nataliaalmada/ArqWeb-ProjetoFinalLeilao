import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';


const BidProduct = () => {

  const [userInput, setUserInput] = useState(0);

  const navigate = useNavigate();


  const handleSubmit = (e) => {

    e.preventDefault();

    navigate('/products');

  };


  return (

    <div>

      <div className="bidproduct__container">

        <h2>Place a Bid</h2>

        <form className="bidProduct__form" onSubmit={handleSubmit}>

          <h3 className="bidProduct__name">Product Name</h3>


          <label htmlFor="amount">Bidding Amount</label>

          <input

            type="number"

            name="amount"

            value={userInput}

            onChange={(e) => setUserInput(e.target.value)}

            required

          />


          <button className="bidProduct__cta">SEND</button>

        </form>

      </div>

    </div>

  );

};


export default BidProduct;