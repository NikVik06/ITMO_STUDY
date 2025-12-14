document.addEventListener('DOMContentLoaded', function() {
    console.log('Form styling initialized');

    const form = document.getElementById('mainForm');
    if (!form) {
        console.error('Form not found');
        return;
    }

    const radios = form.querySelectorAll('input[type="radio"][name*="xInput"]');
    const radioLabels = document.querySelectorAll('.radio-group label');

    console.log('Found radios:', radios.length);

    const xError = form.querySelector('[for*="xInput"] + .validation-error, [id*="xInput_error"]');
    const yError = form.querySelector('[for*="yInput"] + .validation-error, [id*="yInput_error"]');
    const rError = form.querySelector('[for*="rInput"] + .validation-error, [id*="rInput_error"]');

    console.log('Errors found - X:', !!xError, 'Y:', !!yError, 'R:', !!rError);

    function checkXSelected() {
        let selectedRadio = null;

        selectedRadio = form.querySelector('input[type="radio"][name*="xInput"]:checked');

        if (!selectedRadio && radios.length > 0) {
            radios.forEach(radio => {
                if (radio.checked) {
                    selectedRadio = radio;
                }
            });
        }

        return selectedRadio;
    }

    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            console.log('Radio changed:', this.value);

            radioLabels.forEach(label => {
                label.style.borderColor = '#ecf0f1';
                label.style.transform = 'translateY(0)';
            });

            const selectedLabel = this.closest('label');
            if (selectedLabel) {
                selectedLabel.style.borderColor = '#3498db';
                selectedLabel.style.transform = 'translateY(-2px)';
            }

            if (xError) {
                xError.textContent = '';
                xError.style.display = 'none';
            }
        });

        if (radio.checked) {
            const selectedLabel = radio.closest('label');
            if (selectedLabel) {
                selectedLabel.style.borderColor = '#3498db';
                selectedLabel.style.transform = 'translateY(-2px)';
            }
        }
    });

    const yInput = form.querySelector('input[id*="yInput"], input[name*="yInput"]');
    if (yInput) {
        yInput.addEventListener('input', function() {
            const value = this.value.trim();

            if (yError) {
                yError.textContent = '';
                yError.style.display = 'none';
            }

            if (value !== '') {
                const numValue = parseFloat(value);
                if (isNaN(numValue)) {
                    this.classList.add('field-error');
                    if (yError) {
                        yError.textContent = 'Y должен быть числом (например: -2.5, 0, 3.14)';
                        yError.style.display = 'block';
                    }
                } else if (numValue < -3 || numValue > 5) {
                    this.classList.add('field-error');
                    if (yError) {
                        yError.textContent = 'Y должен быть в диапазоне от -3 до 5';
                        yError.style.display = 'block';
                    }
                } else {
                    this.classList.remove('field-error');
                    if (yError) {
                        yError.textContent = '';
                        yError.style.display = 'none';
                    }
                }
            } else {
                this.classList.remove('field-error');
                if (yError) {
                    yError.textContent = '';
                    yError.style.display = 'none';
                }
            }
        });
    }

    const rInput = form.querySelector('select[id*="rInput"], select[name*="rInput"]');
    if (rInput) {
        rInput.addEventListener('change', function() {
            const value = this.value;

            if (rError) {
                rError.textContent = '';
                rError.style.display = 'none';
            }

            if (!value || value === '') {
                this.classList.add('field-error');
                if (rError) {
                    rError.textContent = 'Пожалуйста, выберите радиус R';
                    rError.style.display = 'block';
                }
            } else if (value < 1 || value > 5) {
                this.classList.add('field-error');
                if (rError) {
                    rError.textContent = 'R должен быть в диапазоне от 1 до 5';
                    rError.style.display = 'block';
                }
            } else {
                this.classList.remove('field-error');
                if (rError) {
                    rError.textContent = '';
                    rError.style.display = 'none';
                }
            }
        });
    }

    const checkButton = form.querySelector('[id*="checkPoint"], button[type="submit"]');
    if (checkButton) {
        checkButton.addEventListener('click', function(e) {
            console.log('=== VALIDATION STARTED ===');

            let hasError = false;

            const xSelected = checkXSelected();
            console.log('X selected:', xSelected ? xSelected.value : 'none');

            if (!xSelected) {
                hasError = true;
                radioLabels.forEach(label => {
                    label.style.borderColor = '#e74c3c';
                });
                if (xError) {
                    xError.textContent = 'Пожалуйста, выберите значение X';
                    xError.style.display = 'block';
                }
                console.log('X validation failed');
            } else {
                radioLabels.forEach(label => {
                    const radioInLabel = label.querySelector('input[type="radio"]');
                    if (radioInLabel && radioInLabel !== xSelected) {
                        label.style.borderColor = '#ecf0f1';
                        label.style.transform = 'translateY(0)';
                    }
                });
                if (xError) {
                    xError.textContent = '';
                    xError.style.display = 'none';
                }
                console.log('X validation passed:', xSelected.value);
            }

            if (!yInput || yInput.value.trim() === '') {
                hasError = true;
                if (yInput) yInput.classList.add('field-error');
                if (yError) {
                    yError.textContent = 'Пожалуйста, введите значение Y';
                    yError.style.display = 'block';
                }
                console.log('Y validation failed: empty');
            } else {
                const yValue = parseFloat(yInput.value);
                if (isNaN(yValue)) {
                    hasError = true;
                    yInput.classList.add('field-error');
                    if (yError) {
                        yError.textContent = 'Y должен быть числом (например: -2.5, 0, 3.14)';
                        yError.style.display = 'block';
                    }
                    console.log('Y validation failed: not a number');
                } else if (yValue < -3 || yValue > 5) {
                    hasError = true;
                    yInput.classList.add('field-error');
                    if (yError) {
                        yError.textContent = 'Y должен быть в диапазоне от -3 до 5';
                        yError.style.display = 'block';
                    }
                    console.log('Y validation failed: out of range');
                } else {
                    yInput.classList.remove('field-error');
                    if (yError) {
                        yError.textContent = '';
                        yError.style.display = 'none';
                    }
                    console.log('Y validation passed:', yValue);
                }
            }

            if (!rInput || rInput.value === '') {
                hasError = true;
                if (rInput) rInput.classList.add('field-error');
                if (rError) {
                    rError.textContent = 'Пожалуйста, выберите радиус R';
                    rError.style.display = 'block';
                }
                console.log('R validation failed: empty');
            } else {
                const rValue = parseFloat(rInput.value);
                if (isNaN(rValue) || rValue < 1 || rValue > 5) {
                    hasError = true;
                    rInput.classList.add('field-error');
                    if (rError) {
                        rError.textContent = 'R должен быть числом от 1 до 5';
                        rError.style.display = 'block';
                    }
                    console.log('R validation failed: invalid value');
                } else {
                    rInput.classList.remove('field-error');
                    if (rError) {
                        rError.textContent = '';
                        rError.style.display = 'none';
                    }
                    console.log('R validation passed:', rValue);
                }
            }

            console.log('Validation result:', hasError ? 'FAILED' : 'PASSED');

            if (hasError) {
                if (!this.hasAttribute('onclick') && !this.getAttribute('onclick')) {
                    e.preventDefault();
                }

                const graphMessage = document.getElementById('graph-message');
                if (graphMessage) {
                    graphMessage.textContent = 'Пожалуйста, исправьте ошибки в форме';
                    graphMessage.className = 'graph-message graph-error';
                }

                console.log('Form validation failed, preventing submission');
                return false;
            } else {
                console.log('Form validation passed, allowing submission');

                const graphMessage = document.getElementById('graph-message');
                if (graphMessage) {
                    const xVal = xSelected.value;
                    const yVal = yInput.value;
                    const rVal = rInput.value;
                    graphMessage.textContent = 'Проверка точки: X=' + xVal + ', Y=' + yVal + ', R=' + rVal;
                    graphMessage.className = 'graph-message graph-success';
                }

                return true;
            }
        });
    } else {
        console.error('Check button not found');
    }
    console.log('All radios:');
    radios.forEach((radio, index) => {
        console.log(`Radio ${index}: value=${radio.value}, checked=${radio.checked}, name=${radio.name}, id=${radio.id}`);
    });

    const xSelectedOnLoad = checkXSelected();
    console.log('Initial X selected:', xSelectedOnLoad ? xSelectedOnLoad.value : 'none');
});