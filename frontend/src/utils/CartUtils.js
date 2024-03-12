export const addDecimal =(num) =>{
    
    return (Math.round(num*100) / 100).toFixed(2)
    //return num.toFixed(2)
}


//calculate tprice

export const updateCart =(state) =>{
console.log(state.cartItem)
  
  let itemsPrice =0;
  for (let item of state.cartItem) {
      itemsPrice += item.price * item.qty;
      console.log(item)
    }
  state.itemsPrice = addDecimal(itemsPrice);
  

  // Calculate the shipping price
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  state.shippingPrice = addDecimal( shippingPrice)

  // Calculate the tax price
  const taxPrice = 0.15 * itemsPrice;
  state.taxPrice = addDecimal(taxPrice);

  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  // Calculate the total price
  state.totalPrice = addDecimal(totalPrice);


  // Save the cart to localStorage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;



}







