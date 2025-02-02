// Conversion simple (avec option historique)
document.getElementById('converter-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = document.getElementById('amount').value;
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const date = document.getElementById('date').value;
    const resultDiv = document.getElementById('result');

    if (amount === '' || isNaN(amount) || Number(amount) <= 0) {
        resultDiv.innerText = 'Please enter a valid amount.';
        return;
    }

    let endpoint = '';
    if (date !== '') {
        endpoint = `https://api.frankfurter.app/${date}?amount=${amount}&from=${from}&to=${to}`;
    } else {
        endpoint = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
    }

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.rates && data.rates[to] !== undefined) {
            resultDiv.innerText = `${amount} ${from} = ${data.rates[to]} ${to}`;
        } else {
            resultDiv.innerText = 'Conversion failed. Please try again.';
        }
    } catch (error) {
        console.error('Error during conversion:', error);
        resultDiv.innerText = 'An error occurred. Please try again.';
    }
});

// Graphique d'évolution des devises avec Chart.js
document.getElementById('trend-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;

    if (!startDate || !endDate) {
        alert("Please select both start and end dates for the trend.");
        return;
    }

    // Construire l'URL pour récupérer l'évolution des taux entre startDate et endDate
    const endpoint = `https://api.frankfurter.app/${startDate}..${endDate}?from=${from}&to=${to}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.rates) {
            // Récupérer les dates triées et les taux correspondants
            const dates = Object.keys(data.rates).sort();
            const rates = dates.map(date => data.rates[date][to]);

            // Récupérer le contexte du canvas pour Chart.js
            const ctx = document.getElementById('chart').getContext('2d');

            // Si un graphique existait déjà, le détruire pour pouvoir en créer un nouveau
            if (window.trendChart) {
                window.trendChart.destroy();
            }

            // Créer le graphique
            window.trendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: `${from} to ${to} Exchange Rate`,
                        data: rates,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Exchange Rate'
                            }
                        }
                    }
                }
            });
        } else {
            alert('Failed to load trend data. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching trend data:', error);
        alert('An error occurred while fetching trend data. Please try again.');
    }
});
