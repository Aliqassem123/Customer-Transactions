document.addEventListener('DOMContentLoaded', function() {

    var apiData = {
        customers: [
            { id: 1, name: "Ahmed Ali" },
            { id: 2, name: "Aya Elsayed" },
            { id: 3, name: "Mina Adel" },
            { id: 4, name: "Sarah Reda" },
            { id: 5, name: "Mohamed Sayed" }
        ],
        transactions: [
            { id: 1, customer_id: 1, date: "2022-01-01", amount: 1000 },
            { id: 2, customer_id: 1, date: "2022-01-02", amount: 2000 },
            { id: 3, customer_id: 2, date: "2022-01-01", amount: 550 },
            { id: 4, customer_id: 3, date: "2022-01-01", amount: 500 },
            { id: 5, customer_id: 2, date: "2022-01-02", amount: 1300 },
            { id: 6, customer_id: 4, date: "2022-01-01", amount: 750 },
            { id: 7, customer_id: 3, date: "2022-01-02", amount: 1250 },
            { id: 8, customer_id: 5, date: "2022-01-01", amount: 2500 },
            { id: 9, customer_id: 5, date: "2022-01-02", amount: 875 }
        ]
    };

    var customersTableBody = document.getElementById('customers-data');
    var searchNameInput = document.getElementById('search-name');
    var searchAmountInput = document.getElementById('search-amount');
    var transactionsChart = document.getElementById('transactions-chart').getContext('2d');
    var chart;

 
    function renderTable(data) {
        customersTableBody.innerHTML = '';
        data.forEach(function(item) {
            var row = document.createElement('tr');
            row.innerHTML = '<td>' + item.name + '</td><td>' + item.date + '</td><td>' + item.amount + '</td>';
            row.dataset.customerId = item.customer_id;
            customersTableBody.appendChild(row);
        });
    }

   
    function filterData() {
        var nameQuery = searchNameInput.value.toLowerCase();
        var amountQuery = searchAmountInput.value;

        var filtered = apiData.transactions.filter(function(transaction) {
            var customer = apiData.customers.find(function(c) {
                return c.id === transaction.customer_id;
            });

            var nameMatches = customer.name.toLowerCase().includes(nameQuery);
            var amountMatches = amountQuery === "" || transaction.amount.toString().includes(amountQuery);

            return nameMatches && amountMatches;
        }).map(function(transaction) {
            var customer = apiData.customers.find(function(c) {
                return c.id === transaction.customer_id;
            });
            return {
                customer_id: customer.id,
                name: customer.name,
                date: transaction.date,
                amount: transaction.amount
            };
        });

        renderTable(filtered);
    }

    searchNameInput.addEventListener('input', filterData);
    searchAmountInput.addEventListener('input', filterData);


    renderTable(apiData.transactions.map(function(transaction) {
        var customer = apiData.customers.find(function(c) {
            return c.id === transaction.customer_id;
        });
        return {
            customer_id: customer.id,
            name: customer.name,
            date: transaction.date,
            amount: transaction.amount
        };
    }));

  
    function renderChart(customerId) {
        var customerTransactions = apiData.transactions.filter(function(transaction) {
            return transaction.customer_id === customerId;
        });
        var labels = Array.from(new Set(customerTransactions.map(function(transaction) {
            return transaction.date;
        })));
        var data = labels.map(function(date) {
            return customerTransactions.filter(function(transaction) {
                return transaction.date === date;
            }).reduce(function(total, transaction) {
                return total + transaction.amount;
            }, 0);
        });

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(transactionsChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Transaction Amount',
                    data: data,
                    borderColor: 'rgb(80, 0, 202)',
                    backgroundColor: 'rgba(80, 0, 202, 0.2)'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    customersTableBody.addEventListener('click', function(e) {
        var targetRow = e.target.closest('tr');
        if (targetRow) {
            var customerId = targetRow.dataset.customerId;
            renderChart(parseInt(customerId));
        }
    });

    renderChart(5);
});