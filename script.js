let selectedLabels = [];

function handleDragEvents(productCell, productImg) {
    productCell.addEventListener('dragover', (e) => {
        e.preventDefault();
        productCell.classList.add('dragover');
    });

    productCell.addEventListener('dragleave', () => {
        productCell.classList.remove('dragover');
    });

    productCell.addEventListener('drop', (e) => {
        e.preventDefault();
        productCell.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0 && e.dataTransfer.files[0].type.startsWith('image/')) {
            const file = e.dataTransfer.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                productImg.src = event.target.result;
            };
            reader.readAsDataURL(file);
        } else if (e.dataTransfer.getData('text').includes('data:image') || 
                 e.dataTransfer.getData('text').includes('http')) {
            productImg.src = e.dataTransfer.getData('text');
        }
    });
}

function addLabel(productName, imgSrc, qrData, index) {
    const labelRow = document.createElement('div');
    labelRow.classList.add('label-row');

    // Añadir número de etiqueta
    const labelNumber = document.createElement('div');
    labelNumber.classList.add('label-number');
    labelNumber.textContent = (index + 1).toString();
    labelRow.appendChild(labelNumber);

    const productCell = document.createElement('div');
    productCell.classList.add('product-cell');
    const productImg = document.createElement('img');
    productImg.src = imgSrc;
    productCell.appendChild(productImg);

    handleDragEvents(productCell, productImg);

    const nameCell = document.createElement('div');
    nameCell.classList.add('name-cell');
    const nameTextarea = document.createElement('textarea');
    nameTextarea.value = productName;
    nameTextarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, this.parentElement.offsetHeight - 4) + 'px';
    });
    nameCell.appendChild(nameTextarea);

    const qrCell = document.createElement('div');
    qrCell.classList.add('qr-cell');
    const qrImg = document.createElement('img');
    qrImg.src = qrData;
    qrCell.appendChild(qrImg);

    labelRow.appendChild(productCell);
    labelRow.appendChild(nameCell);
    labelRow.appendChild(qrCell);

    document.getElementById('labelsContainer').appendChild(labelRow);
    selectedLabels.push({
        imgElement: productImg,
        nameInput: nameTextarea,
        qrImg,
        row: labelRow
    });
}

function clearAll() {
    // Limpiar códigos QR
    document.querySelectorAll('.code-input').forEach(input => {
        input.value = '';
    });

    // Limpiar etiquetas
    selectedLabels.forEach(label => {
        label.imgElement.src = 'https://via.placeholder.com/150';
        label.nameInput.value = '';
        label.qrImg.src = '';
    });
}

function updateQRCode(index, text) {
    if (!text.trim()) return;
    
    const qr = qrcode(0, 'L');
    qr.addData(text);
    qr.make();
    
    if (selectedLabels[index]) {
        selectedLabels[index].qrImg.src = qr.createDataURL(4, 0);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Crear 20 etiquetas iniciales
    for(let i = 0; i < 20; i++) {
        addLabel('', 'https://via.placeholder.com/150', '', i);
    }

    // Configurar eventos de códigos QR
    document.querySelectorAll('.code-input').forEach((input, index) => {
        input.addEventListener('input', (e) => {
            updateQRCode(index, e.target.value);
        });
    });

    // Configurar botón de imprimir
    document.getElementById('printButton').addEventListener('click', () => {
        window.print();
    });
});