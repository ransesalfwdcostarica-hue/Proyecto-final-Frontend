

async function testRegister() {
    try {
        const payload = {
            correo: "test_final@example.com",
            contrasenia: "123456",
            nombre: "Test Final",
            edad: 25
        };

        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", data);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

testRegister();
