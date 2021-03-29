async function deleteFormHandler(event) {
    event.preventDefault();

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];


    resp = await fetch(`/api/posts/${post_id}`, {
        method: 'DELETE',
    });
    if (resp.ok) {
        document.location.replace('/dashboard/')
    } else {
        alert(resp.statusText);
    }
}

document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);
