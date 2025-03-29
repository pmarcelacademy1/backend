import Ticket from "../models/Ticket.js"


export const getTickets = async (req, res) => {
   
        const tickets = await Ticket.find();
        res.json(tickets);
     
  };

  export const ticketPurchases = async (req, res) => {
    const { type, email } = req.body;
    const ticket = await Ticket.findOne({ type });
    if (ticket.quantityAvailable <= 0) return res.status(400).json({ message: 'Sold out' });
    ticket.quantityAvailable -= 1;
    ticket.email = email;
    await ticket.save();
    res.json({ message: 'Ticket purchased successfully', ticket });
};