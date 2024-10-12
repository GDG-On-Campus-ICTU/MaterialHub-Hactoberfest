class TechMaterialsApp {
    constructor() {
        this.materials = [];
        this.isDarkMode = false;
        this.init();
    }

    async init() {
        try {
            const storedDarkMode = localStorage.getItem('darkMode');
            if (storedDarkMode === 'true') {
                this.isDarkMode = true;
                this.updateTheme();
            }
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
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Failed to load materials');
            this.materials = await response.json();

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
        const contributor = this.escapeHtml(document.getElementById('contributor').value);
        const resourceName = this.escapeHtml(document.getElementById('resourceName').value);
        const link = this.escapeHtml(document.getElementById('link').value);
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
        this.materials.push(material);
        this.renderMaterials();
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

    renderMaterials(materialsToRender = this.materials) {
        const container = document.getElementById('materialsList');
        container.innerHTML = '';

        materialsToRender.forEach(material => {
            const card = this.createMaterialCard(material);
            container.appendChild(card);
        });
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

    //in cases where escapeHtml is used for href attributes
    escapeHtmlAttribute(unsafe){
        return unsafe.replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    } // now links can be used like this::: <a href="${this.escapeHtmlAttribute(material.link)}" target="_blank">${this.escapeHtml(material.link)}</a>

    showError(message) {
        console.error(message);
        // You could implement a more user-friendly error display here
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.updateTheme();
        localStorage.setItem('darkMode', this.isDarkMode);
    }

    updateTheme() {
        const body = document.body;
        const addMaterialSection = document.querySelector('.add-material');
        const materialCards = document.querySelectorAll('.material-card');
        const header = document.querySelector('h1');
        const labels = document.querySelectorAll('label');

        if (this.isDarkMode) {
            body.classList.add('dark-mode');
            addMaterialSection.classList.add('dark-mode');
            materialCards.forEach(card => card.classList.add('dark-mode'));
            header.classList.add(' dark-mode');
            labels.forEach(label => label.classList.add('dark-mode'));
        } else {
            body.classList.remove('dark-mode');
            addMaterialSection.classList.remove('dark-mode');
            materialCards.forEach(card => card.classList.remove('dark-mode'));
            header.classList.remove('dark-mode');
            labels.forEach(label => label.classList.remove('dark-mode'));
        }
    }
}

// Initialize the application
new TechMaterialsApp();