import express from "express";
const router = express.Router()
import Talent from "../models/Talent.js"

// Talent Routes
router.get('/', async (req, res) => {
    const talents = await Talent.find();
    res.json(talents);
  });
  
  router.post('/', async (req, res) => {
    const talent = new Talent(req.body);
    await talent.save();
    res.status(201).json(talent);
  });
  
  router.put('/:id', async (req, res) => {
    const talent = await Talent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(talent);
  });
  
  router.delete('/:id', async (req, res) => {
    await Talent.findByIdAndDelete(req.params.id);
    res.status(204).send();
  });
  
  export default router
  