

class TechMaterialsApp {
    constructor() {
        this.materials = [];
        this.isDarkMode = false;
        this.init();
    }

    async init() {
        try {
            await this.loadMaterials();
            this.setupEventListeners();
            this.renderMaterials();
            this.updateTheme(); 
        } catch (error) {
            this.showError('Failed to initialize the application');
        }
    }

 
    async loadMaterials() {
        try {
            // Fetch data from 'data.json'
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Failed to load materials from data.json');
            const fileMaterials = await response.json();
    
            // Fetch data from localStorage
            const localStorageMaterials = JSON.parse(localStorage.getItem('materials')) || [];
    
            // Merge materials from 'data.json' and localStorage
            this.materials = [...fileMaterials, ...localStorageMaterials];
    
            console.log(this.materials);
        } catch (error) {
            console.error('Error loading materials:', error);
            throw new Error('Error loading materials: ' + error.message);
        }
    }
    


    setupEventListeners() {
        // Form submission
        document.getElementById('materialForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Theme toggle button
        const toggleButton = document.getElementById('toggleTheme');
            toggleButton.addEventListener('click', () => {
                this.toggleTheme();
            });
    }

    handleFormSubmission() {
        const contributor = document.getElementById('contributor').value;
        const resourceName = document.getElementById('resourceName').value;
        const link = document.getElementById('link').value;
        const tags = document.getElementById('tags').value;

        const newMaterial = {
            contributor,
            resourceName,
            link,
            tags: tags.split(',').map(tag => tag.trim())
        };

        this.addMaterial(newMaterial);
        this.resetForm();
    }


    addMaterial(material) {
        // Retrieve the existing materials array from local storage or initialize it as an empty array
        let storedMaterials = JSON.parse(localStorage.getItem('materials')) || [];
    
        // Add the new material to the materials array
        storedMaterials.push(material);
    
        // Save the updated materials array back to local storage
        localStorage.setItem('materials', JSON.stringify(storedMaterials));
    
        // Update the local state if needed (e.g., for rendering purposes)
        this.materials = storedMaterials;
        this.renderMaterials();
        console.log(material);
    }
    
    

    resetForm() {
        document.getElementById('materialForm').reset();
    }

    handleSearch(searchTerm) {
        const filteredMaterials = this.materials.filter(material => {
            const searchString = `${material.contributor} ${material.resourceName} ${material.tags.join(' ')}`.toLowerCase();
            return searchString.includes(searchTerm.toLowerCase());
        });
        this.renderMaterials(filteredMaterials);
    }

    async renderMaterials() {
        try {
            // Fetch data from 'data.json'
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Failed to load materials from data.json');
            const fileMaterials = await response.json();
    
            // Fetch data from localStorage
            const localStorageMaterials = JSON.parse(localStorage.getItem('materials')) || [];
    
            // Merge materials from 'data.json' and localStorage
            const combinedMaterials = [...fileMaterials, ...localStorageMaterials];
    
            // Now render the combined materials
            const container = document.getElementById('materialsList');
            container.innerHTML = '';
    
            combinedMaterials.forEach(material => {
                const card = this.createMaterialCard(material);
                container.appendChild(card);
            });
    
        } catch (error) {
            console.error('Error rendering materials:', error);
        }
    }
    

    createMaterialCard(material) {
        const card = document.createElement('div');
        card.className = 'material-card';

        card.innerHTML = `
            <h3>${this.escapeHtml(material.resourceName)}</h3>
            <p><strong>Contributor:</strong> ${this.escapeHtml(material.contributor)}</p>
            <p><strong>Link:</strong> <a href="${this.escapeHtml(material.link)}" target="_blank">${this.escapeHtml(material.link)}</a></p>
            <div class="tags">
                ${material.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
            </div>
        `;

        return card;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showError(message) {
        console.error(message);
        // You could implement a more user-friendly error display here
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.updateTheme();
    }

    updateTheme() {
        const body = document.body;
        const addMaterialSection = document.querySelector('.add-material');
        const materialCards = document.querySelectorAll('.material-card');
        const header = document.querySelector('h1'); // Select the header
        const labels = document.querySelectorAll('label'); // Select all labelsed
        if (this.isDarkMode) {
            body.classList.add('dark-mode');
            addMaterialSection.classList.add('dark-mode');
            materialCards.forEach(card => card.classList.add('dark-mode'));
            header.classList.add('dark-mode'); // Add dark-mode class to header
            labels.forEach(label => label.classList.add('dark-mode')); // Add dark-mode class to all labels
        } else {
            body.classList.remove('dark-mode');
            addMaterialSection.classList.remove('dark-mode');
            materialCards.forEach(card => card.classList.remove('dark-mode'));
            header.classList.remove('dark-mode'); // Remove dark-mode class from header
            labels.forEach(label => label.classList.remove('dark-mode')); // Remove dark-mode class from all labels
        }
    }
}

// Initialize the application
new TechMaterialsApp();