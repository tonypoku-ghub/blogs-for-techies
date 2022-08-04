const gotoBlogEdit = async (event) => {
  if (event.currentTarget.hasAttribute("data-id")) {
    const id = event.currentTarget.getAttribute("data-id");
    document.location.replace(`/blogs/${id}`);
  }
};

document.querySelector(".blog-item").addEventListener("click", gotoBlogEdit);
