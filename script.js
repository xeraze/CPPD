// Placeholder password for future change — replace before public release
const PASS = 'CHANGE_ME';
let generatedOTP = '';

function formatHashHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}

async function hashValue(value) {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return formatHashHex(buffer);
}

async function verifyPassword(inputValue) {
    return inputValue === PASS;
}

function initializeSystemDefaults() {
    const now = new Date();
    const kyivOptions = { timeZone: 'Europe/Kiev', year: 'numeric', month: 'long', day: 'numeric' };
    const kyivDate = now.toLocaleDateString('uk-UA', kyivOptions).replace(' р.', '');
    document.getElementById('in-date').value = kyivDate + ' року';

    const year = now.getFullYear();
    const randomDigits = Math.floor(1000000 + Math.random() * 9000000);
    document.getElementById('in-erdr').value = `1${year}1600${randomDigits}`;

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    document.getElementById('in-order').value = `№${day}-${month}/${year}`;
}

function updateDoc() {
    const typeValue = document.getElementById('in-type').value;
    const subtitleEl = document.getElementById('in-subtitle');
    const wrapFabula = document.getElementById('wrapper-fabula');
    const wrapVstanovyv = document.getElementById('wrapper-vstanovyv');
    const wrapPostanovyv = document.getElementById('wrapper-postanovyv');
    const wrapProcuror = document.getElementById('wrapper-procuror');
    const paperFabula = document.getElementById('paper-fabula');
    const paperVstanovyv = document.getElementById('paper-vstanovyv');
    const paperPostanovyv = document.getElementById('paper-postanovyv');
    const sigSingle = document.getElementById('sig-single');
    const sigDouble = document.getElementById('sig-double');
    const docPreview = document.getElementById('document-preview');
    const labelVstanovyv = document.getElementById('label-vstanovyv');
    const labelPostanovyv = document.getElementById('label-postanovyv');
    const headVstanovyv = document.getElementById('header-vstanovyv');
    const headPostanovyv = document.getElementById('header-postanovyv');

    document.getElementById('out-type').textContent = typeValue.split('').join(' ');
    subtitleEl.readOnly = false;
    subtitleEl.className = 'panel-input';
    subtitleEl.value = subtitleEl.value || 'до Єдиного реєстру досудових розслідувань';

    if (typeValue === 'ВИТЯГ') {
        wrapFabula.classList.add('show');
        wrapVstanovyv.classList.remove('show');
        wrapPostanovyv.classList.remove('show');
        wrapProcuror.classList.remove('show');
        document.getElementById('wrapper-proc-signature').classList.remove('show');
        paperFabula.classList.remove('hidden');
        paperVstanovyv.classList.add('hidden');
        paperPostanovyv.classList.add('hidden');
        sigSingle.style.display = 'flex';
        sigDouble.style.display = 'none';
        docPreview.classList.add('watermark-active');
        document.getElementById('qrcode').style.display = 'flex';
        document.getElementById('label-intro').textContent = 'Вступна частина:';
        subtitleEl.value = 'до Єдиного реєстру досудових розслідувань';
        subtitleEl.readOnly = true;
        subtitleEl.className = 'w-full rounded p-2 text-sm';
    } else if (typeValue === 'ПОСТАНОВА') {
        wrapFabula.classList.remove('show');
        wrapVstanovyv.classList.add('show');
        wrapPostanovyv.classList.add('show');
        wrapProcuror.classList.remove('show');
        document.getElementById('wrapper-proc-signature').classList.remove('show');
        paperFabula.classList.add('hidden');
        paperVstanovyv.classList.remove('hidden');
        paperPostanovyv.classList.remove('hidden');
        sigSingle.style.display = 'flex';
        sigDouble.style.display = 'none';
        docPreview.classList.remove('watermark-active');
        document.getElementById('qrcode').style.display = 'none';
        document.getElementById('label-intro').textContent = 'Вступна частина (Хто розглянув):';
        labelVstanovyv.textContent = 'ВСТАНОВИВ:';
        labelPostanovyv.textContent = 'ПОСТАНОВИВ:';
        headVstanovyv.textContent = 'ВСТАНОВИВ:';
        headPostanovyv.textContent = 'ПОСТАНОВИВ:';
    } else if (typeValue === 'ПРИПИС') {
        wrapFabula.classList.remove('show');
        wrapVstanovyv.classList.add('show');
        wrapPostanovyv.classList.add('show');
        wrapProcuror.classList.remove('show');
        document.getElementById('wrapper-proc-signature').classList.remove('show');
        paperFabula.classList.add('hidden');
        paperVstanovyv.classList.remove('hidden');
        paperPostanovyv.classList.remove('hidden');
        sigSingle.style.display = 'flex';
        sigDouble.style.display = 'none';
        docPreview.classList.remove('watermark-active');
        document.getElementById('qrcode').style.display = 'none';
        document.getElementById('label-intro').textContent = 'Вступна частина:';
        labelVstanovyv.textContent = 'ВСТАНОВИВ (Обґрунтування):';
        labelPostanovyv.textContent = 'ВИМАГАЮ:';
        headVstanovyv.textContent = 'ВСТАНОВИВ:';
        headPostanovyv.textContent = 'ВИМАГАЮ:';
    } else if (typeValue === 'ПОВІДОМЛЕННЯ') {
        wrapFabula.classList.remove('show');
        wrapVstanovyv.classList.add('show');
        wrapPostanovyv.classList.add('show');
        wrapProcuror.classList.add('show');
        document.getElementById('wrapper-proc-signature').classList.add('show');
        paperFabula.classList.add('hidden');
        paperVstanovyv.classList.remove('hidden');
        paperPostanovyv.classList.remove('hidden');
        sigSingle.style.display = 'none';
        sigDouble.style.display = 'block';
        docPreview.classList.remove('watermark-active');
        document.getElementById('qrcode').style.display = 'none';
        document.getElementById('label-intro').textContent = 'Вступна частина:';
        labelVstanovyv.textContent = 'ВСТАНОВИВ:';
        labelPostanovyv.textContent = 'ПОВІДОМЛЯЮ:';
        headVstanovyv.textContent = 'ВСТАНОВИВ:';
        headPostanovyv.textContent = 'ПОВІДОМЛЯЮ:';
    } else {
        wrapFabula.classList.remove('show');
        wrapVstanovyv.classList.remove('show');
        wrapPostanovyv.classList.remove('show');
        wrapProcuror.classList.remove('show');
        document.getElementById('wrapper-proc-signature').classList.remove('show');
        paperFabula.classList.add('hidden');
        paperVstanovyv.classList.add('hidden');
        paperPostanovyv.classList.add('hidden');
        sigSingle.style.display = 'flex';
        sigDouble.style.display = 'none';
        docPreview.classList.remove('watermark-active');
        document.getElementById('qrcode').style.display = 'none';
        document.getElementById('label-intro').textContent = 'Текст документа (Основне тіло):';
    }

    document.getElementById('out-subtitle').textContent = subtitleEl.value;
    document.getElementById('out-date').textContent = document.getElementById('in-date').value;
    document.getElementById('out-intro').textContent = document.getElementById('in-intro').value;
    document.getElementById('out-vstanovyv').textContent = document.getElementById('in-vstanovyv').value;
    document.getElementById('out-postanovyv').textContent = document.getElementById('in-postanovyv').value;
    document.getElementById('out-fabula').textContent = document.getElementById('in-fabula').value;
    document.getElementById('out-article').textContent = document.getElementById('in-article').value;

    const positionVal = document.getElementById('in-position').value;
    const nameVal = document.getElementById('in-name').value;
    document.getElementById('out-position').textContent = positionVal;
    document.getElementById('out-name').textContent = nameVal;
    document.getElementById('out-position-double').textContent = positionVal;
    document.getElementById('out-name-double').textContent = nameVal;
    document.getElementById('out-proc-role').textContent = document.getElementById('in-proc-role').value;
    document.getElementById('out-proc-name').textContent = document.getElementById('in-proc-name').value;

    document.getElementById('out-order').textContent = 'Наказ ' + document.getElementById('in-order').value;
    document.getElementById('out-erdr').textContent = 'ЄРДР: ' + document.getElementById('in-erdr').value;
}

function showUnsupportedState(message) {
    const supportState = document.getElementById('support-state');
    if (supportState) {
        // Do not overwrite existing markup — preserve the static HTML content
        // (which contains the desired "Доступ обмежено" text and README link).
        supportState.classList.remove('hidden');
    }

    document.getElementById('password-step').classList.add('hidden');
    document.getElementById('otp-step').classList.add('hidden');
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('password-input').value = '';
}

async function login() {
    const passwordField = document.getElementById('password-input');
    const value = passwordField.value.trim();
    const pwErrorEl = document.getElementById('password-error');
    if (pwErrorEl) pwErrorEl.classList.add('hidden');

    if (!value) {
        if (pwErrorEl) {
            pwErrorEl.textContent = 'Будь ласка, введіть пароль.';
            pwErrorEl.classList.remove('hidden');
        }
        return;
    }

    if (await verifyPassword(value)) {
        // Correct password: show central technical-mode notice (access blocked)
        showUnsupportedState('Сайт XDEVS зараз тимчасово не підтримується. Доступ до конструктора документів заблоковано до відновлення сервісу.');
    } else {
        // Incorrect password: only show inline error, do not trigger central technical notice
        if (pwErrorEl) {
            pwErrorEl.textContent = 'Невірний пароль доступу.';
            pwErrorEl.classList.remove('hidden');
        }
    }
}

function verify() {
    const otpValue = document.getElementById('otp-input').value.trim();
    if (otpValue === generatedOTP) {
        showUnsupportedState('Сайт XDEVS зараз тимчасово не підтримується. Доступ до конструктора документів заблоковано до відновлення сервісу.');
        return;
    }

    showUnsupportedState('Код підтвердження недоступний. Сайт XDEVS переведено в технічний режим, тому доступ до конструктора документів зараз обмежено.');
}

function clearSignature() {
    document.getElementById('in-signature').value = '';
    document.getElementById('out-signature-img').classList.add('hidden');
    document.getElementById('out-signature-line').style.display = '';
    const secondImg = document.getElementById('out-signature-img-double');
    if (secondImg) secondImg.classList.add('hidden');
}

function clearSignatureProc() {
    document.getElementById('in-signature-proc').value = '';
    document.getElementById('out-signature-proc-img').classList.add('hidden');
}

function bindFileUpload(inputId, outputId, hideLineId = null) {
    const input = document.getElementById(inputId);
    input.addEventListener('change', function (event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.getElementById(outputId);
            img.src = e.target.result;
            img.classList.remove('hidden');
            if (hideLineId) {
                document.getElementById(hideLineId).style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    });
}

function init() {
    initializeSystemDefaults();

    document.getElementById('password-input').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            login();
        }
    });

    // Hide inline password error when user types
    const pwEl = document.getElementById('password-input');
    const pwErrorEl = document.getElementById('password-error');
    if (pwEl && pwErrorEl) {
        pwEl.addEventListener('input', function () {
            pwErrorEl.classList.add('hidden');
            pwErrorEl.textContent = '';
        });
    }

    document.getElementById('otp-input').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            verify();
        }
    });

    bindFileUpload('in-signature', 'out-signature-img', 'out-signature-line');
    bindFileUpload('in-signature-proc', 'out-signature-proc-img');

    const supervisedInputs = [
        'in-type', 'in-subtitle', 'in-intro', 'in-vstanovyv',
        'in-postanovyv', 'in-fabula', 'in-article',
        'in-position', 'in-name', 'in-proc-role', 'in-proc-name'
    ];

    supervisedInputs.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateDoc);
        }
    });

    document.getElementById('in-type').addEventListener('change', updateDoc);
    document.getElementById('password-step').classList.remove('hidden');
    document.getElementById('otp-step').classList.add('hidden');
    document.getElementById('support-state').classList.add('hidden');
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
    // Show central technical-mode notice immediately (site unavailable)
    showUnsupportedState('Сайт XDEVS зараз тимчасово не підтримується. Доступ до конструктора документів тимчасово закрито.');
    updateDoc();
}

window.addEventListener('DOMContentLoaded', init);

window.login = login;
window.verify = verify;
window.clearSignature = clearSignature;
window.clearSignatureProc = clearSignatureProc;
window.updateDoc = updateDoc;
