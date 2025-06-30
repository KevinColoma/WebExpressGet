const express = require('express');
const router = express.Router();
const Notification = require('../models/notifications');

// CRUD BÁSICO
router.get('/notifications', async (req, res) => {
  try { res.json(await Notification.find()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/notifications/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notificación no encontrada' });
    res.json(notification);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/notifications', async (req, res) => {
  try {
    const notification = new Notification(req.body); await notification.save();
    res.status(201).json(notification);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/notifications/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notification) return res.status(404).json({ error: 'Notificación no encontrada' });
    res.json(notification);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/notifications/:id', async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Notificación no encontrada' });
    res.json({ message: 'Notificación eliminada' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Notificaciones no leídas
router.get('/notifications/unread', async (req, res) => {
  try {
    const notifications = await Notification.find({ read: false });
    res.json(notifications);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Marcar notificación como leída
router.post('/notifications/mark-read/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!notification) return res.status(404).json({ error: 'Notificación no encontrada' });
    res.json(notification);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Marcar todas como leídas
router.post('/notifications/mark-all-read', async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    res.json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;