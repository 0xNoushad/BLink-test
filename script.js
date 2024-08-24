const showMoreToggle = document.getElementById('show-more');
const additionalOptions = document.getElementById('additional-options');
const toggleLabel = document.getElementById('toggle-label');
const fileUpload = document.getElementById('file-upload');
const file = document.getElementById('image');

showMoreToggle.addEventListener('change', function() {
    additionalOptions.classList.toggle('show');
    toggleLabel.classList.toggle('active');
    if (this.checked) {
        toggleLabel.innerHTML = 'Hide more options <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
    } else {
        toggleLabel.innerHTML = 'Show more options <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
    }
});

fileUpload.addEventListener('click', function() {
    file.click();
});

file.addEventListener('change', function() {
    if (file.files.length > 0) {
        const fileName = file.files[0].name;
        fileUpload.querySelector('p').textContent = `File selected: ${fileName}`;
    }
});

document.getElementById('coin-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Connect to the user's Solana wallet
    try {
        const provider = window.solana;
        if (!provider) {
            alert('Solana wallet not found. Please install a wallet like Phantom.');
            return;
        }

        await provider.connect();

        // Get the form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const ticker = formData.get('ticker');
        const description = formData.get('description');
        // Additional form data can be added here as needed

        // Create a Solana transaction to call the pump function
        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));
        const publicKey = provider.publicKey;

        // Example of calling a smart contract (program) function on Solana
        const programId = new solanaWeb3.PublicKey('4x5U5QpXi4pNnDK9hpmZnV1gYNw78Ns1NWn5KtK5sksc'); // Replace with your Blink program's public key
        const pumpInstruction = new solanaWeb3.TransactionInstruction({
            keys: [
                {pubkey: publicKey, isSigner: true, isWritable: false},
                // Add more keys as required by the Blink pump function
            ],
            programId: programId,
            data: Buffer.from(Uint8Array.of(0, ...new TextEncoder().encode(name + ticker + description))) // This is an example; adapt it to match the actual program's data requirements
        });

        // Create transaction and add the instruction
        const transaction = new solanaWeb3.Transaction().add(pumpInstruction);

        // Send transaction
        const signature = await provider.sendTransaction(transaction, connection);

        // Confirm transaction
        await connection.confirmTransaction(signature, 'confirmed');

        alert('Coin created successfully on Solana using the pump function!');
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the coin.');
    }
});