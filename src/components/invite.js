import React, { useEffect, useState } from "react";

const DiscordInvite = ({ inviteCode }) => {
  const [invite, setInvite] = useState(null);
  useEffect(() => {
    const key = `discordInvite:${inviteCode}`;

    // Check and return from cache first :)
    const cacheVal = localStorage.getItem(key);
    if (cacheVal !== null) {
      try {
        const cache = JSON.parse(cacheVal);
        if (cache.expires !== undefined && cache.value !== undefined) {
          if (Date.now() < cache.expires) {
            return setInvite(cache.value);
          } else {
            // It expired so we won't return it, let's fetch it again!
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
          return;
        }

        // Save in cache - set it to expire in 3 hours :)
        const cache = {
          value: content,
          expires: Date.now() + 1000 * 60 * 60 * 3,
        };
        localStorage.setItem(key, JSON.stringify(cache));

        return setInvite(content);
      })
      .catch((err) => {
        console.error("Couldn't fetch invite!", err);
      });
  }, [inviteCode]);

  if (!invite) return null;

  return (
    <div className="di grow">
      <h5 className="di-title">You've been invited to join a server</h5>
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
          <div className="di-d-name">{invite.guild.name}</div>
          <div className="di-d-details">
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
        <div className="di-break"></div>
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
