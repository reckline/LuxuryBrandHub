const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        unique: true 
    },
    imageUrl: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'active' 
    },
    // Brands list for this category
    brands: [{ 
        type: String 
    }],
    // New field for Dynamic Sizes
    sizes: [{ 
        type: String 
    }]
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Category', categorySchema);