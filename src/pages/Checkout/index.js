import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '~/components/Navbar';

import { store } from '~/store';
import api from '~/services/api';
import { cepMask } from '~/utils/functions';

import './styles.css';

function Checkout() {
  const { cart, total } = useSelector(appState => appState.cart);
  const [valueDiscount, setValueDiscount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [zipCode, setZipCode] = useState(
    store.getState().user.profile.address.zip_code
  );
  const [freight, setFreight] = useState(0);

  async function handleDiscount() {
    if (discount === 0 || discount < 0) {
      toast.error('Insira um código de desconto válido');
    }

    await api
      .get(`discount/${discount}`)
      .then(res => {
        setValueDiscount((res.data.percentage * total) / 100);

        const response = (res.data.percentage * total) / 100;

        toast.success(`Você recebeu um desconto de R$ ${response.toFixed(2)}`);
      })
      .catch(err => {
        toast.error(err.response.data.message);
      });
  }

  function handleFreight() {
    if (zipCode === '') {
      toast.error('Insira um cep válido');
    }
  }

  return (
    <div className="wrapper-container">
      <Navbar />

      <main>
        <section className="checkout-container">
          <h3 className="w3-animate-right">Finalizar Compra</h3>
          <hr />

          <div className="main-checkout w3-animate-bottom">
            <div style={{ flex: '1' }} className="checkout-support">
              <div
                style={{
                  maxHeight: '240px',
                  overflow: 'auto',
                  paddingRight: cart.length > 4 ? '10px' : '0px',
                }}
              >
                {cart.map(product => {
                  return (
                    <div
                      key={product.product.code}
                      className="checkout-products"
                    >
                      <h4>{product.product.title}</h4>

                      <h4>{product.product.quantity}</h4>
                      <h4>R$ {product.product.price.toFixed(2)}</h4>
                    </div>
                  );
                })}
              </div>
              <div className="checkout-finish">
                <h4>Pagamento</h4>
              </div>
            </div>

            <div className="cart-total">
              <header className="cart-total-header">
                <h4>CHECKOUT</h4>

                <div className="checkout-detail">
                  <div className="container-input">
                    <input
                      className="input-checkout"
                      type="text"
                      placeholder="Código do Cupom"
                      onChange={e => setDiscount(e.target.value)}
                    />
                    <button
                      className="button-checkout"
                      type="submit"
                      onClick={handleDiscount}
                    >
                      Utilizar
                    </button>
                  </div>
                  <h4>DESCONTO (-):</h4>
                  <h3>R$ {valueDiscount.toFixed(2)}</h3>
                </div>
                <div className="checkout-detail">
                  <div className="container-input">
                    <input
                      className="input-checkout"
                      type="text"
                      placeholder="Cep"
                      onChange={e => setZipCode(e.target.value)}
                      value={cepMask(zipCode)}
                    />
                    <button
                      className="button-checkout"
                      type="submit"
                      onClick={handleFreight}
                    >
                      Calcular
                    </button>
                  </div>
                  <h4>FRETE (+):</h4>
                  <h3>R$ 0.00</h3>
                </div>
                <div className="checkout-detail">
                  <h4>TOTAL DO PEDIDO (=):</h4>
                  <h3>R$ {(total - valueDiscount).toFixed(2)}</h3>
                </div>
              </header>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Checkout;
