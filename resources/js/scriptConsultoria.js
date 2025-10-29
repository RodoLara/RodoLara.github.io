// scriptConsultoria.js
const AZURE_FUNCTION_URL = "https://backendrl-db-a5hygcb4fpfdf8as.southcentralus-01.azurewebsites.net/api/webpage_consultoria?code=RJJuJBA-_GZSQaQuDhgI-a7GxWlhM1v6boyqzDVtpSfUAzFuR23C0w%3D%3D"; // <- reemplaza

document.getElementById('consultForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  const form = this;
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.spinner');
  const notice = document.getElementById('submitNotice');

  submitBtn.disabled = true;
  btnText.textContent = 'Enviando…';
  spinner.classList.remove('hidden');
  notice.style.display = 'block';
  notice.textContent = '⏳ Enviando tu solicitud...';

  try {
    const formData = new FormData(form);

    // Validación simple del adjunto (si existe)
    const adjInput = document.getElementById('adjunto');
    if (adjInput && adjInput.files && adjInput.files.length) {
      const maxMB = 10;
      Array.from(adjInput.files).forEach((file) => {
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > maxMB) {
          alert(`El archivo ${file.name} excede ${maxMB} MB. Reduce su tamaño o envia sin adjunto.`);
          throw new Error('archivo_too_large');
        }
        formData.append('adjunto', file); // agregamos todos los archivos
      });
    }

    // Llamada al endpoint de Azure Function
    const resp = await fetch(AZURE_FUNCTION_URL, {
      method: 'POST',
      body: formData
    });

    const text = await resp.text();

    if (resp.ok) {
      alert('✅ Solicitud enviada correctamente. En breve nos comunicaremos contigo por correo o teléfono.');
      form.reset();
      // actualizar contador si aplica
      const cc = document.getElementById('charCounter');
      if (cc) cc.textContent = '0/1000';
    } else {
      console.error('Error del servidor:', resp.status, text);
      alert('❌ Ocurrió un error al enviar. Revisa la consola para más detalles o escribe a support@rodolfolara.com');
    }
  } catch (err) {
    if (err.message !== 'archivo_too_large') {
      console.error('Error enviando formulario:', err);
      alert('⚠️ Error al enviar el formulario. Intenta de nuevo más tarde.');
    }
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = 'Solicitar Diagnóstico Gratuito';
    spinner.classList.add('hidden');
    notice.style.display = 'none';
  }
});
