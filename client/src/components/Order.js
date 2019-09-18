import React from "react";
import styled from "styled-components";

import Button from "./Button";
import { FiEdit } from "react-icons/fi";
import { makeStyles } from "@material-ui/core/styles";
import OrderItem from "./OrderItem";
import { colors, layout } from "../themes/theme";

const Container = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
  margin: 15px 0px;

  h2 {
    margin: 0px;
    font-weight: bold;
  }

  .order-info-container {
    display: flex;
    border: 1px solid ${colors.brand};
  }

  .details-table {
    padding: 1rem;
    flex-basis: 375px;
    background-color: white;

    tr {
      height: 50px;
    }

    .detail-label {
      font-weight: bold;
    }
  }

  .order-items-container {
    flex-grow: 1;
    background-color: white;
    background-color: ${colors.background};
  }

  ul {
    overflow-y: auto;
    max-height: 300px;
    list-style: none;
    padding: 1rem;
    margin: 0px;
  }

  .order-item {
    font-size: 0.5rem;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    font-size: 1rem;

    img {
      width: 50px;
      height: 50px;
    }

    div {
      padding: 10px;
      flex-grow: 1;
    }

    h1 {
      margin: 5px 0px;
      font-size: 1.3rem;
      padding: 0px;
      text-align: left;
    }
    p {
      display: flex;
      margin: 0px;
      justify-content: space-between;
    }
  }

  .total-container {
    display: flex;
    justify-content: space-between;
    padding: ${layout.spacing(2)} ${layout.spacing(3)};
    border-top: 1px solid ${colors.faint};

    background-color: white;
  }

  .total-label {
    font-size: 1rem;
    font-weight: bold;
  }
  .total {
    font-weight: bold;
    color: ${colors.brand};
  }

  #arrival-container {
    display: flex;
    justify-content: space-between;
    padding: ${layout.spacing(2)} ${layout.spacing(3)};
    font-size: 0.8rem;
    span:nth-of-type(1) {
      font-weight: bold;
    }
    span:nth-of-type(2) {
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;

const useStyles = makeStyles({
  header: {
    height: "20%",
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    color: colors.brand,
    border: "1px solid " + colors.brand
  },
  Container: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.3)",
    padding: 20,
    margin: "15px 0px"
  },
  info: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

const Order = ({ order }) => {
  const classes = useStyles();
  console.log("Order.js: order:", order);
  const orderItems = order.dishes.map(item => <OrderItem {...item} />);

  return (
    <Container>
      <div className={classes.header}>
        <h2>
          Order <span>{order._id}</span>
        </h2>
      </div>
      <div className="order-info-container">
        <table className="details-table">
          <tr>
            <td>
              <span className="detail-label">Status</span>
            </td>
            <td>
              <span>{order.status}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="detail-label">Order Placed</span>
            </td>
            <td>
              <span>{getArrivalTimeString(order.bookedTime)}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="detail-label">Appointment Date</span>
            </td>
            <td>
              <span>{getArrivalTimeString(order.createdAt)}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="detail-label">Customer Name</span>
            </td>
            <td>
              <span>
                {order.customer ? (
                  <span>{order.customer.name}</span>
                ) : (
                  "Loading..."
                )}
              </span>
            </td>
          </tr>
        </table>
        <div className="order-items-container">
          <ul>{orderItems}</ul>
          <div className="total-container">
            <span className="total-label">Total</span>
            <span className="total">${order.price}</span>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Order;

function getArrivalTimeString(date) {
  date = new Date(date);

  const split = date.toDateString().split(" ");

  const [time, amOrPm] = date.toLocaleTimeString().split(" ");

  return `${split[1]} ${split[2]} at ${time.slice(
    0,
    -3
  )}${amOrPm.toLowerCase()}`;
}
