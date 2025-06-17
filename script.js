    const birthdayForm = document.getElementById('birthdayForm');
    const notifications = document.getElementById('notifications');
    const savedList = document.getElementById('savedList');


    function saveBirthday(name, date) {
      let birthdays = JSON.parse(localStorage.getItem('birthdays')) || [];
      birthdays.push({ name, date });
      localStorage.setItem('birthdays', JSON.stringify(birthdays));
      showSaved();
    }


    function showSaved() {
      let birthdays = JSON.parse(localStorage.getItem('birthdays'));
      savedList.innerHTML = '<h3>Saved Birthdays:</h3>';

      let today = new Date();

      for (let i = 0; i < birthdays.length; i++) {
        let [year, month, day] = birthdays[i].date.split('-');
        let eventYear = today.getFullYear();

        let eventDateThisYear = new Date(`${eventYear}-${month}-${day}`);
        eventDateThisYear.setHours(0, 0, 0, 0);


        if (eventDateThisYear < today) {
          eventYear++;
        }

        const googleDate = `${eventYear}${month}${day}`;
        const googleLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${birthdays[i].name} Birthday&dates=${googleDate}/${googleDate}&details=Birthay Reminder&recur=RRULE:FREQ=YEARLY`

        savedList.innerHTML += `
          <p>
            ${birthdays[i].name} — ${day}.${month}.${year}
            <a href="${googleLink}" target="_blank" title="Google Calendar" style="margin-left: 5px; border: none">&#128197;</a>
            <button onclick="deleteBirthday(${i})" style="background:none; cursor:pointer;" title="Delete">&#10060;</button>
          </p>
        `;
      }
    }


    function deleteBirthday(i) {
      let birthdays = JSON.parse(localStorage.getItem('birthdays'));
      birthdays.splice(i, 1);
      localStorage.setItem('birthdays', JSON.stringify(birthdays));
      showSaved();
      checkBirthdays();
    }


    function checkBirthdays() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let birthdays = JSON.parse(localStorage.getItem('birthdays'));

      notifications.innerHTML = '';

      for (let i = 0; i < birthdays.length; i++) {
        let birthDate = new Date(birthdays[i].date);
        birthDate.setFullYear(today.getFullYear());
        birthDate.setHours(0, 0, 0, 0);
        if (birthDate < today) {
          birthDate.setFullYear(today.getFullYear() + 1);
        }

        const diffDays = Math.floor((birthDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          notifications.innerHTML += `<p>&#127874; Today is ${birthdays[i].name}'s birthday!</p>`;
        } else if (diffDays > 0 && diffDays <= 7) {
          notifications.innerHTML += `<p>&#9203; ${birthdays[i].name}'s birthday is in ${diffDays} days!</p>`;
        }
      }
    }


    birthdayForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const date = document.getElementById('date').value;
      saveBirthday(name, date);
      birthdayForm.reset();
    });

    
    showSaved();
    checkBirthdays();
