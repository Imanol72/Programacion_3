import { useState, useEffect } from 'react';


function App() {
  const [steamAchivementsList, setSteamAchivementsList] = useState([])

  useEffect(() => {
    // Fetch Steam achievements list
    fetch('https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?appid=730&key=EED5CF3679BA2F9B2AEAE8155317EC70&steamid=76561198127194058',{
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin':'https://store.steampowered.com/'
      }
    })
     .then((response) => response.json())
     .then((data) => {
      console.log(data)
        if (data.playerstats.achievements) {
          const achievementsList = data.playerstats.achievements.map((achievement) => ({
            name: achievement.apiname,
            description: achievement.description.english,
            completed: achievement.achieved,
          }));
          setSteamAchivementsList(achievementsList);
        }
      });
  }, []);

  return (
    <>
<h1>Steam Achievements List</h1>
<ul>
  {steamAchivementsList.map((achievement, index) => (
    <li key={index}>
      <strong>{achievement.name}</strong>: {achievement.completed? 'Completed' : 'Not Completed'} - {achievement.description}
    </li>
  ))}
</ul>
    </>
  )
}

export default App
