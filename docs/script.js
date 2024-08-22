async function loadJSON(file) {
    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error("Network problems");
      }
      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
  
var data = await loadJSON("data.json");
  