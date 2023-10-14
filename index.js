var cuentas = [
    { nombre: "a", saldo: 200, contraseña: "1" },
    { nombre: "Mali", saldo: 200, contraseña: "pass1" },
    { nombre: "Gera", saldo: 290, contraseña: "pass2"},
    { nombre: "Maui", saldo: 67, contraseña: "pass3" }
  ];
  
  function verificarCredenciales() {
    let nombreIngresado = document.getElementById("userName").value;
    let contraseñaIngresada = document.getElementById("password").value;
    let credencialesCorrectas = false;
    for (let i = 0; i < cuentas.length; i++) {
      let cuenta = cuentas[i];
      if (cuenta.nombre === nombreIngresado && cuenta.contraseña === contraseñaIngresada) {
        // Almacenar el nombre de usuario en localStorage
        localStorage.setItem('username', nombreIngresado);
        window.location.href = 'cajero.html';
        return;
      }
    }
  
    mostrarAlerta();
  }

  function mostrarAlerta() {
    const alertaDiv = document.getElementById('alerta');
    alertaDiv.innerHTML = `
        <div class="alert alert-danger" role="alert">
            Credenciales incorrectas. 
        </div>
    `;
     // Limpia el campo de contraseña
     document.getElementById('password').value = '';
    setTimeout(() => {
        alertaDiv.innerHTML = "";  
    }, 1000);
}
 

  var saldoVisible = false;
  document.addEventListener('DOMContentLoaded', () => {
      const username = localStorage.getItem('username');
      const userInfoDiv = document.getElementById('user-info');

      if (username) {
          const user = cuentas.find(account => account.nombre === username);

          if (user) {
              // Mostrar los datos completos del usuario
              userInfoDiv.innerHTML = 
                      `<h5 class="card-header">Usuario: ${user.nombre}</h5>`;
          } else {
              userInfoDiv.innerHTML = "<p>Usuario no encontrado.</p>";
          }
      } 
  });

  function toggleMostrarSaldo() { //"toggle" para mostrar u ocultar un elemento con el ID 'user-saldo'
    const userSaldoDiv = document.getElementById('user-saldo');
    saldoVisible = !saldoVisible;
    userSaldoDiv.style.display = saldoVisible ? 'block' : 'none';

    if (saldoVisible) {
        mostrarSaldo();
    } else {
        userSaldoDiv.innerHTML = '';
    }
}

function mostrarSaldo() {
    const userSaldoDiv = document.getElementById('user-saldo');
    const usuarioActual = localStorage.getItem('username');
    const claveSaldo = `userSaldo-${usuarioActual}`;

    // Obtén el saldo del localStorage
    let saldoActual = parseFloat(localStorage.getItem(claveSaldo));

    if (isNaN(saldoActual) || saldoActual === null) {
        const user = cuentas.find(account => account.nombre === usuarioActual);
        saldoActual = user ? user.saldo : null;
    }

    if (saldoActual !== null) {
        // Actualiza el saldo en el array 'cuentas' también
        cuentas.find(account => account.nombre === usuarioActual).saldo = saldoActual;

        userSaldoDiv.innerHTML = `
            <div class="card">
                <h5 class="card-header">Saldo actual: $${saldoActual.toFixed(2)}</h5>
            </div>`;
    } else {
        userSaldoDiv.innerHTML = `
            <div class="card">
                <h5 class="card-header">No existe el usuario</h5>
            </div>`;
    }
}




function realizarAccion(accion) {
    const monto = parseFloat(document.getElementById('monto').value);

    if (isNaN(monto) || monto <= 0) {
        alert("Por favor, ingrese un monto válido mayor que cero.");
        return;
    }

    const usuarioActual = localStorage.getItem('username');
    const user = cuentas.find(account => account.nombre === usuarioActual);

    if (user) {
        var saldoAnterior = user.saldo;
        if (accion === 'ingresar') {
            const nuevoSaldo = user.saldo + monto;

            if (nuevoSaldo > 990) {
                alert("El saldo no debe exceder $990.");
                return;
            }

            user.saldo = nuevoSaldo;
        } else if (accion === 'retirar') {
            if (user.saldo - monto < 10) {
                alert("El saldo no debe ser menor a $10.");
                return;
            }

            user.saldo -= monto;
        }

        // Actualiza el saldo en localStorage asociado al nombre de usuario
        localStorage.setItem(`userSaldo-${usuarioActual}`, user.saldo);

        // Actualiza el saldo mostrado en la página
        mostrarSaldo();
        mostrarNuevoSaldo(saldoAnterior, monto, user.saldo, accion);
    }
}




 function mostrarNuevoSaldo(saldoAnterior, cantidad, saldoActual, accion) {
      const nuevoSaldoDiv = document.getElementById('nuevo-saldo');
      nuevoSaldoDiv.innerHTML = `
          <div class="card">
              <h5 class="card-header">Saldo anterior: $${saldoAnterior.toFixed(2)}</h5>
              <h5 class="card-header">${accion}: $${cantidad.toFixed(2)}</h5>
              <h5 class="card-header">Nuevo Saldo: $${saldoActual.toFixed(2)}</h5>
          </div>`;
  } 

  function cerrarSesion() {
    window.location.href = 'login.html';
}


//para que las cuentas incien con el dato del array (saldo) es necesario borrar cache!