document.getElementById('programmerForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  const btnText   = submitBtn.querySelector('.btn-text');
  const spinner   = submitBtn.querySelector('.spinner');

  // -----  Desactiva y muestra spinner  -----
  submitBtn.disabled = true;
  btnText.textContent = 'Enviando…';
  spinner.classList.remove('hidden');

  document.getElementById('submitNotice').style.display = 'block';

  try {
    const formData = new FormData(this);

    // Obtener valor de la selección de CV
    const cvSelect = document.getElementById('cv_select');
    const cvInput  = document.getElementById('cv');
    let file;
    let blob;

    if (cvSelect && cvSelect.value === "no") {
      console.log("📄 El usuario NO subió un CV. Usando el placeholder.");
    
      const response = await fetch("/resources/docs/CV_Placeholder.pdf");
      blob     = await response.blob();
    
      file = new File([blob], "CV_Placeholder.pdf", { type: "application/pdf" });
    } else {
      if (!(cvInput && cvInput.files.length)) {
        alert('⚠️ Por favor, sube tu CV antes de enviar.');
        throw new Error('Falta CV');
      }
    
      file = cvInput.files[0];
      const maxSizeMB   = 5;
      const fileSizeMB  = file.size / (1024 * 1024);
    
      if (fileSizeMB > maxSizeMB) {
        alert(`⚠️ El archivo excede el tamaño máximo permitido de ${maxSizeMB}MB.`);
        throw new Error('Archivo demasiado grande');
      }
    }

    // ✅ Este log se ejecuta en ambos casos
    console.log("📄 CV real subido por el usuario:", file.name);
    console.log("Placeholder", file);
    //formData.append("cv", file);
    formData.append("cv", blob, "CV_Placeholder.pdf");

    console.log("Datos del FormData:");
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    // --- Llamada al backend ---
    const resp = await fetch(
      'https://backendrl-db-a5hygcb4fpfdf8as.southcentralus-01.azurewebsites.net/api/webpage_db',
      { method: 'POST', body: formData }
    );
    const msg = await resp.text();

    if (resp.status === 200) {
      // Éxito solo si es 200
      console.log('✅ Servidor respondió:', msg);
      alert(
        '✅ Formulario enviado correctamente 🎉\n\n' +
        '📩 Te he enviado un correo con tu enlace de descarga. ' +
        'Si no lo ves en tu bandeja principal, revisa la carpeta de spam o correo no deseado.\n\n' +
        '📝 Si necesitas modificar o eliminar tus datos, puedes escribirme a support@rodolfolara.com 📨'
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
    } else {
      // Si no es 200, trato como error
      console.error('❌ Error del servidor:', resp.status, msg);
      if (resp.status === 502) {
        alert(
          '❌ No se pudo enviar el correo de confirmación.\n\n' +
          '📩 Por favor, revisa que tu correo esté correctamente escrito.\n' +
          'Si el problema persiste, escríbeme directamente a support@rodolfolara.com 📨'
        );
      } else {
        alert('❌ Ocurrió un error al enviar el formulario. Inténtalo de nuevo.');
      }
    
    }

  } catch (err) {
    if (err.message !== 'Falta CV') {  // no volver a mostrar alerta de CV faltante
      console.error('❌ Error al enviar:', err);
      alert('⚠️ Ocurrió un error al enviar el formulario. Intenta más tarde.');
    }
  } finally {
    // -----  Restablece botón  -----
    submitBtn.disabled = false;
    btnText.textContent = 'Enviar';
    spinner.classList.add('hidden');
    submitNotice.style.display = 'none';  // ⬅️ Aquí se oculta de nuevo el aviso
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

  // Detecta el scroll y ajusta la posición del gradiente
/*document.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;  
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;

    // Ajusta el ángulo o posición de colores
    document.body.style.backgroundPosition = `0% ${scrollPercent * 100}%`;
});*/
