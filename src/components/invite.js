import React, { useEffect, useState } from "react";

const DiscordInvite = ({ inviteCode, isLightMode }) => {
  const [invite, setInvite] = useState(null);
  useEffect(() => {
    const key = `discordInvite:${inviteCode}`;

    const cacheVal = localStorage.getItem(key);
    if (cacheVal !== null) {
      try {
        const cache = JSON.parse(cacheVal);
        if (cache.expires !== undefined && cache.value !== undefined) {
          if (Date.now() < cache.expires) {
            return setInvite(cache.value);
          } else {
            localStorage.removeItem(key);
          }
        }
      } catch (err) {
        console.error("Couldn't get Invite data from cache.", err);
      }
    }

    fetch(
      `https://discordapp.com/api/v6/invites/${inviteCode}?with_counts=true`
    )
      .then((res) => res.json())
      .then((content) => {
        if (content.guild === undefined) {
          setInvite(null);
          return;
        }
        const cache = {
          value: content,
          expires: Date.now() + 1000 * 60 * 60 * 3,
        };
        localStorage.setItem(key, JSON.stringify(cache));

        return setInvite(content);
      })
      .catch((err) => {
        setInvite(null);
        console.error("Couldn't fetch invite!", err);
      });
  }, [inviteCode]);

  if (!invite) return null;

  return (
    <div
      className="di-iroot"
      style={isLightMode ? { background: "#f2f3f5" } : null}
    >
      <h5
        className="di-title"
        style={isLightMode ? { color: "#4f5660" } : null}
      >
        You've been invited to join a server
      </h5>
      <div className="di-content di-flex">
        <div
          className="di-icon"
          style={{
            backgroundImage: `url(https://cdn.discordapp.com/icons/${
              invite.guild.id
            }/${invite.guild.icon}.${
              invite.guild.icon.startsWith("a_") ? "gif" : "png"
            }`,
          }}
        ></div>
        <div className="di-details di-flex">
          <div s>
            <h5
              onClick={() =>
                window.open(`https://discord.gg/${invite.code}`, "_blank")
              }
              style={isLightMode ? { color: "rgb(6,6,7)" } : null}
              className="di-d-name"
            >
              {invite.guild.name}
            </h5>
          </div>
          <div
            className="di-d-details"
            style={isLightMode ? { color: "#4f5660" } : null}
          >
            <i className="di-d-d-online"></i>
            <span>
              {invite.approximate_presence_count.toLocaleString()} Online
            </span>
            <i className="di-d-d-offline"></i>
            <span>
              {invite.approximate_member_count.toLocaleString()} Members
            </span>
          </div>
        </div>
        <a
          href={`https://discord.gg/${invite.code}`}
          target="_blank"
          rel="noopener noreferrer"
          type="button"
          className="di-button"
        >
          Join
        </a>
      </div>
    </div>
  );
};

export default DiscordInvite;
