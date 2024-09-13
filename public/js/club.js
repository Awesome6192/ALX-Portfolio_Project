document.addEventListener('DOMContentLoaded', function() {
    const clubList = document.getElementById('club-list');
    const clubContent = document.getElementById('club-content');
    const clubContentInput = document.getElementById('club-content-input');
    const submitClubInfoButton = document.getElementById('submit-club-info');
    const clubHeader = document.getElementById('club-header');
    let currentClubId = 'default';
    let currentUserId = 'user123'; // Example user ID

    // Fetch and display club list (mock data)
    function loadClubList() {
        fetch('/api/clubs')
            .then(response => response.json())
            .then(clubs => {
                clubList.innerHTML = clubs.map(club => `
                    <div class="club-item" data-id="${club.id}">
                        ${club.name}
                    </div>
                `).join('');
                
                // Add click event listener to each club item
                document.querySelectorAll('#club-list .club-item').forEach(item => {
                    item.addEventListener('click', function() {
                        openClub(this.dataset.id);
                    });
                });
            });
    }

    // Open a specific club
    function openClub(clubId) {
        currentClubId = clubId;
        clubHeader.innerHTML = `<i class="material-icons">sports_soccer</i> ${clubId}`;
        fetch(`/api/clubs/${clubId}`)
            .then(response => response.json())
            .then(info => {
                clubContent.innerHTML = `
                    <div class="club-info">
                        <p>${info.description}</p>
                    </div>
                `;
            });
    }

    // Submit new club information
    function submitClubInfo() {
        const info = clubContentInput.value.trim();
        if (info) {
            fetch(`/api/clubs/${currentClubId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: currentUserId,
                    description: info
                })
            }).then(response => response.json())
            .then(result => {
                if (result.success) {
                    clubContentInput.value = '';
                    openClub(currentClubId); // Refresh the club info
                }
            });
        }
    }

    submitClubInfoButton.addEventListener('click', submitClubInfo);

    // Initialize
    loadClubList();
});