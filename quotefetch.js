export async function getQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        // Do something with the data
        // console.log(data)
        return data;
    } catch (error) {
        // Handle the error
        console.error(error);
    }
}