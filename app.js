const container = document.querySelector(".container");

container.addEventListener("dragover", event => {
    event.preventDefault();
});

container.addEventListener("drop", event => {
    event.preventDefault();
    if (container.querySelectorAll('.player').length >= 6) {
        alert('Maximum of six players allowed on the pitch.');
        return;
    }
    const playerData = JSON.parse(event.dataTransfer.getData("text/plain"));
    const goalkeeperArea = document.querySelector('.goalkeeper-area');
    const rect = goalkeeperArea.getBoundingClientRect();
    const dropX = event.clientX;
    const dropY = event.clientY;
    if (dropX >= rect.left && dropX <= rect.right && dropY >= rect.top && dropY <= rect.bottom) {
        // Place as goalkeeper
        placeGoalkeeper(playerData);
    } else {
        // Place as field player
        placeFieldPlayer(event, playerData);
    }
    document.getElementById(playerData.id).style.display = 'none';
});

function placeGoalkeeper(player) {
    // Remove any existing goalkeeper
    const existingGoalkeeper = container.querySelector('.goalkeeper');
    if (existingGoalkeeper) {
        existingGoalkeeper.remove();
    }
    // Create and place the new goalkeeper
    const goalkeeper = document.createElement('div');
    goalkeeper.className = 'player goalkeeper';
    goalkeeper.textContent = player.name;
    goalkeeper.style.left = goalkeeperArea.offsetLeft + 'px';
    goalkeeper.style.top = goalkeeperArea.offsetTop + 'px';
    goalkeeper.style.width = goalkeeperArea.offsetWidth + 'px';
    goalkeeper.style.height = goalkeeperArea.offsetHeight + 'px';
    goalkeeper.style.lineHeight = goalkeeper.offsetHeight + 'px';
    container.appendChild(goalkeeper);
    // Prevent goalkeeper from being draggable
    goalkeeper.draggable = false;
    // Add remove button
    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-player';
    removeBtn.textContent = 'X';
    removeBtn.addEventListener('click', () => {
        goalkeeper.remove();
        const playerItem = document.getElementById(player.id);
        playerItem.style.display = 'block';
    });
    goalkeeper.appendChild(removeBtn);
}

function placeFieldPlayer(event, playerData) {
    const playerElement = document.createElement("div");
    playerElement.className = "player field-player";
    playerElement.textContent = playerData.name;
    playerElement.dataset.playerId = playerData.id;
    playerElement.style.left = `${event.clientX - container.getBoundingClientRect().left}px`;
    playerElement.style.top = `${event.clientY - container.getBoundingClientRect().top}px`;
    container.appendChild(playerElement);
    // Make field players draggable within the pitch
    playerElement.draggable = true;
    playerElement.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(playerData));
    });
    // Add remove button
    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-player';
    removeBtn.textContent = 'X';
    removeBtn.addEventListener('click', () => {
        playerElement.remove();
        const playerItem = document.getElementById(playerData.id);
        playerItem.style.display = 'block';
    });
    playerElement.appendChild(removeBtn);
}

fetch('players.json')
    .then(response => response.json())
    .then(players => {
        players.forEach(player => {
            createPlayerElement(player);
        });
    });

function createPlayerElement(player) {
    const playerItem = document.createElement('div');
    playerItem.id = player.id;
    playerItem.className = 'player-draggable';
    playerItem.draggable = true;
    playerItem.textContent = player.name;
    playerItem.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(player));
    });
    document.body.appendChild(playerItem);
}
function constrainPosition(event) {
    const containerRect = container.getBoundingClientRect();
    const player = event.target;
    if (player.classList.contains('field-player')) {
        let left = event.clientX - containerRect.left;
        let top = event.clientY - containerRect.top;
        // Constrain within pitch boundaries
        left = Math.max(0, Math.min(containerRect.width - player.offsetWidth, left));
        top = Math.max(0, Math.min(containerRect.height - player.offsetHeight, top));
        player.style.left = left + 'px';
        player.style.top = top + 'px';
    }
}

container.addEventListener('drag', event => {
    if (event.target.classList.contains('field-player')) {
        constrainPosition(event);
    }
});
