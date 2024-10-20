
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { PrismaClientValidationError } = require('@prisma/client/runtime/library');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Add a new user
router.post('/add', async (req, res) => {
    const { email, password, name, telephone } = req.body;
    try {
        const user = await prisma.user.create({
            data: {
                email,
                password,
                name,
                telephone,

            },
        });
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof PrismaClientValidationError) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to create user' });
        }
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { email, password, name, telephone } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                email,
                password,
                name,
                telephone,
            },
        });
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof PrismaClientValidationError) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to update user' });
        }
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: Number(id) },
        });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
