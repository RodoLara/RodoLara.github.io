//document.getElementById('programmerForm').addEventListener('submit', function(event) {
//    event.preventDefault();
//
//    const formData = new FormData(this);
//
//    // Verifica que se haya subido un archivo CV
//    const cvInput = document.getElementById('cv');
//    if (cvInput && cvInput.files.length > 0) {
//        formData.append('cv', cvInput.files[0]);
//    } else {
//        alert("⚠️ Por favor, sube tu CV antes de enviar.");
//        return;
//    }
//
//    fetch("https://backendrl-db-a5hygcb4fpfdf8as.southcentralus-01.azurewebsites.net/api/webpage_db", {
//        method: "POST",
//        body: formData
//    })
//    .then(res => res.text())
//    .then(msg => {
//        console.log("✅ Servidor respondió:", msg);
//        alert(
//            "✅ Formulario enviado correctamente 🎉\n\n" +
//            "Recuerda que si necesitas modificar o eliminar tus datos, puedes escribirme a support@rodolfolara.com"
//        );
//    })
//    .catch(err => {
//        console.error("❌ Error al enviar:", err);
//        alert("Ocurrió un error al enviar el formulario. Intenta más tarde.");
//    });
//});


document.getElementById('programmerForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const submitBtn   = document.getElementById('submitBtn');
  const btnText     = submitBtn.querySelector('.btn-text');
  const spinner     = submitBtn.querySelector('.spinner');

  // -----  Desactiva y muestra spinner  -----
  submitBtn.disabled = true;
  btnText.textContent = 'Enviando…';
  spinner.classList.remove('hidden');

  try {
    const formData = new FormData(this);

    // Valida CV
    const cvInput = document.getElementById('cv');
    if (!(cvInput && cvInput.files.length)) {
      alert('⚠️ Por favor, sube tu CV antes de enviar.');
      throw new Error('Falta CV');
    }
    formData.append('cv', cvInput.files[0]);

    // --- Llamada al backend ---
    const resp = await fetch(
      'https://backendrl-db-a5hygcb4fpfdf8as.southcentralus-01.azurewebsites.net/api/webpage_db',
      { method: 'POST', body: formData }
    );
    const msg  = await resp.text();
    console.log('✅ Servidor respondió:', msg);

    alert(
      '✅ Formulario enviado correctamente 🎉\n\n' +
      '📝 Recuerda que si necesitas modificar o eliminar tus datos, ' +
      'puedes escribirme a support@rodolfolara.com 📨'
    );

    // Limpieza de Formulario
    this.reset();
    toggleCheckboxes('plc');
    toggleCheckboxes('hmi_scada');
    toggleCheckboxes('robot');
    toggleCheckboxes('vision');
    toggleCheckboxes('estandares');
    toggleCheckboxes('diseno_electrico');
    mostrarCampos();

    //Erorr
  } catch (err) {
    if (err.message !== 'Falta CV') {    // no repitas alerta si ya se mostró
      console.error('❌ Error al enviar:', err);
      alert('Ocurrió un error al enviar el formulario. Intenta más tarde.');
    }
  } finally {
    // -----  Restablece botón  -----
    submitBtn.disabled = false;
    btnText.textContent = 'Enviar';
    spinner.classList.add('hidden');
  }
});


function toggleCheckboxes(group) {
    var selectElement = document.getElementById(group + '_select');
    var checkboxesElement = document.getElementById(group + '_checkboxes');
    if (selectElement.value === 'si') {
        checkboxesElement.classList.remove('hidden');
    } else {
        checkboxesElement.classList.add('hidden');
    }
}

document.getElementById('plc_select').addEventListener('change', function() {
    toggleCheckboxes('plc');
});

document.getElementById('hmi_scada_select').addEventListener('change', function() {
    toggleCheckboxes('hmi_scada');
});

document.getElementById('robot_select').addEventListener('change', function() {
    toggleCheckboxes('robot');
});

document.getElementById('vision_select').addEventListener('change', function() {
    toggleCheckboxes('vision');
});

document.getElementById('estandares_select').addEventListener('change', function() {
    toggleCheckboxes('estandares');
});


document.addEventListener("DOMContentLoaded", function() {
    var textarea = document.getElementById('informacion_adicional');
    var charCounter = document.getElementById('charCounter');

    textarea.addEventListener('input', function() {
        var currentLength = textarea.value.length;
        charCounter.textContent = `${currentLength}/2500`;
    });
});

function mostrarCampos() {
    var tipoPreferencia = document.getElementById("tipo_preferencia").value;
    var campoEmpleo = document.getElementById("campo_empleo");
    var campoProyecto = document.getElementById("campo_proyecto");

    if (tipoPreferencia === "empleo") {
        campoEmpleo.style.display = "block";
        campoProyecto.style.display = "none";
    } else if (tipoPreferencia === "proyecto") {
        campoEmpleo.style.display = "none";
        campoProyecto.style.display = "block";
    } else {
        campoEmpleo.style.display = "none";
        campoProyecto.style.display = "none";
    }
}

mostrarCampos();

const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('blur', function() {
    const phoneNumber = phoneInput.value.replace(/\D/g, ''); // Eliminar cualquier carácter que no sea dígito
    if (phoneNumber.length === 9 || phoneNumber.length === 10) {
        // El número tiene 9 o 10 dígitos
        console.log('Número válido:', phoneNumber);
        // Aquí puedes realizar cualquier otra lógica necesaria
    } else {
        // El número no tiene el formato esperado
        console.log('Número inválido');
        // Puedes mostrar un mensaje de error o realizar alguna acción adicional
    }
});

// Para cada checkbox dentro de un <label>
  document.querySelectorAll('label > input[type="checkbox"]').forEach(chk => {
    // encuentra el <input type="text"> del mismo label
    const txt = chk.parentElement.querySelector('input[type="text"]');
    if (!txt) return;                         // no hay campo de texto, salta

    chk.addEventListener('change', () => {
      txt.disabled = !chk.checked;            // habilita / deshabilita
      if (txt.disabled) txt.value = '';       // limpia al desmarcar
    });
  });