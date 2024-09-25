document.addEventListener('DOMContentLoaded', () => {
    const pastDataInput = document.getElementById('pastDataInput');
    const fetchDataButton = document.getElementById('fetchDataButton');
    const exportButton = document.getElementById('exportDataButton');
    const tableBodyElement = document.querySelector('#merchantInfo tbody');
    const tableElement = document.querySelector('#merchantInfo');
    const caption = document.createElement('caption');

    tableElement.appendChild(caption);

    const updateDisplay = (zipCode) => {
        const storedData = JSON.parse(localStorage.getItem(zipCode));
        if (storedData) {
            caption.textContent = `${storedData.firstApiData["place name"]}, ${storedData.firstApiData.state}`;

            // Clear existing table rows
            while (tableBodyElement.firstChild) {
                tableBodyElement.removeChild(tableBodyElement.firstChild);
            }

            storedData.secondApiData.forEach(merchant => {
                const tr = document.createElement('tr');

                // Create and append the first column cell
                const td1 = document.createElement('td');
                td1.textContent = merchant.merchantName;
                tr.appendChild(td1);
        
                // Create and append the second column cell
                const td2 = document.createElement('td');
                td2.textContent = merchant.addressString;
                tr.appendChild(td2);
        
                // Append the row to the table body
                tableBodyElement.appendChild(tr);
            });
        }
    };

    // Function to fetch data from the first and second APIs
    const fetchData = async (zipCode) => {
        // Local storage object
        let localStorageObj = JSON.parse(localStorage.getItem(zipCode)) || null;

        // Load data from localStorage if available
        if (localStorageObj) {
            console.log('localStorage is available');
            updateDisplay(zipCode);
            return; // Exit the function, no need to make API call
        }

        try {
            const response = await fetch(`https://search-merchant.onrender.com/api/data?pastData=${zipCode}`);
            const data = await response.json();

            // Store fetched data in localStorage
            localStorage.setItem(zipCode, JSON.stringify(data));
            localStorageObj = JSON.parse(localStorage.getItem(zipCode))
            console.log('Data fetched successfully:');
            updateDisplay(zipCode);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchDataButton.addEventListener('click', () => {
        const zipCode = pastDataInput.value;
        if (zipCode) {
            fetchData(zipCode);
        }
    });

    exportButton.addEventListener('click', () => {
        exportTableToCSV();
    });

    function exportTableToCSV() {
        const rows = tableBodyElement.querySelectorAll('tr');
        
        // Check if the table is empty
        if (rows.length === 0 || (rows.length === 1 && rows[0].querySelectorAll('td, th').length === 0)) {
            alert('The table is empty and cannot be exported.');
            return;
        }

        let csv = [];

        // Loop through each row
        for (let row of rows) {
            const cols = row.querySelectorAll('td, th');
            let rowData = [];
            // Loop through each column in the row
            for (let col of cols) {
                rowData.push(col.innerText);
            }
            csv.push(rowData.join(','));
        }

        // Create a CSV file
        const csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });

        // Create a link to download it
        const downloadLink = document.createElement('a');
        downloadLink.download = 'merchant-list.csv';
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = 'none';

        // Append the link to the document body
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Remove the link from the document
        document.body.removeChild(downloadLink);
    }
});