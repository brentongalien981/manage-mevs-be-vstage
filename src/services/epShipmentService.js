const EasyPostClient = require('@easypost/api');
const DefaultInternalError = require('../errors/DefaultInternalError');
const Order = require('../models/order');
const My = require('../utils/My');
const client = new EasyPostClient(process.env.EASYPOST_API_KEY);


const epShipmentService = {
  buyShippingLabel: async (req) => {
    
    const order = await Order.findById(req.body.orderId);

    const fromAddress = await getEpFromAddress();
    const toAddress = await getEpToAddress(order);
    const parcel = await getEpParcel();
    const shipment = await setEpShipment(fromAddress, toAddress, parcel);


    if (!shipment || !shipment.postage_label || !shipment.tracker) {
      throw new DefaultInternalError("Error buying shipping label.");
    }


    return {
      shipmentId: shipment.id,
      shipmentPostageLabelUrl: shipment.postage_label.label_url,
      shipmentTrackerUrl: shipment.tracker.public_url
    };

  },

  getShipmentDetails: async (shipmentId) => {
    let shipmentInfo;

    try {
      const shipment = await client.Shipment.retrieve(shipmentId);
      shipmentInfo = {
        shipmentLabelUrl: shipment.postage_label.label_url,
        trackingUrl: shipment.tracker.public_url
      };
    } catch (error) {
      shipmentInfo = null;
    }

    return shipmentInfo;
  
  }
};


async function getEpFromAddress() {
  return await client.Address.create({
    street1: process.env.EP_COMPANY_ADDRESS_STREET,
    city: process.env.EP_COMPANY_ADDRESS_CITY,
    state: process.env.EP_COMPANY_ADDRESS_PROVINCE,
    zip: process.env.EP_COMPANY_ADDRESS_POSTAL_CODE,
    country: process.env.EP_COMPANY_ADDRESS_COUNTRY,
    company: process.env.EP_COMPANY_NAME,
    phone: process.env.EP_COMPANY_PHONE_NUM
  });
}


async function getEpToAddress(order) {
  return await client.Address.create({
    name: order.getCustomerFullName(),
    street1: "210 Lesmill Road",
    city: "North York",
    state: "Ontario",
    zip: "M3B 2T5",
    country: "Canada",
    phone: order.phone
  });
}


async function getEpParcel() {
  return await client.Parcel.create({
    length: 20.2,
    width: 10.9,
    height: 5,
    weight: 65.9,
  });
}


async function setEpShipment(fromAddress, toAddress, parcel) {
  let shipment = await client.Shipment.create({
    from_address: fromAddress,
    to_address: toAddress,
    parcel: parcel
  });

  try {
    shipment = await client.Shipment.buy(
      shipment.id,
      shipment.lowestRate()
    );
  } catch (error) {
    throw new DefaultInternalError(error.message);
  }


  return shipment;
}


module.exports = epShipmentService;