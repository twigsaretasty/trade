console.log("Trading home page.");

fetch(`https://script.google.com/macros/s/AKfycbxYaR1NkZ8F7q1xh7gSYEQPMsnFKv5JvHKIK9L1dHazFgLBrtOWf1EwAWJNiRNDmpBu4g/exec`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Process the data as needed
    })