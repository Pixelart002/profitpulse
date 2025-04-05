  const curtainMenu = document.getElementById('curtain-menu');
  const menuButton = document.getElementById('click');
  const closeMenuButton = document.getElementById('close-menu');

  menuButton.addEventListener('click', (event) => {
    event.preventDefault();
    curtainMenu.classList.toggle('open');
  });

  closeMenuButton.addEventListener('click', () => {
    curtainMenu.classList.remove('open');
  });
  
  
  
    // Get the modal 
    
    
    var modal = document.getElementById('myModal'); // Get the link that opens the modal
    var link = document.getElementById('openModalLink');
    // Get the <span> element that closes the modal
    var span = document.getElementById('closeModalBtn');
    // When the user clicks the link, open the modal
    link.onclick = function(event) {
      event.preventDefault();
      // Prevent default anchor behavior 
      var rect = link.getBoundingClientRect();
      modal.style.display = 'block';
      modal.style.top = `${rect.top + window.scrollY}px`;
      modal.style.left = `${rect.left + window.scrollX}px`;
    } // When the user clicks on <span> (x), close the modal 
    span.onclick = function() { modal.style.display = 'none'; }
    // Optional: close the modal when user clicks outside of it
    window.onclick = function(event) { if (event.target === modal) { modal.style.display = 'none'; } }