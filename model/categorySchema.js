const mongoose = require('mongoose');

// Brand sub-document structure
const brandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }
});

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
    // Brands list ab objects store karegi
    brands: [brandSchema], 
    // New field for Dynamic Sizes
    sizes: [{ 
        type: String 
    }]
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Category', categorySchema);