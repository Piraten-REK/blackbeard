# Blackbeard

RSS-Feed to Discord Bot.

> **WORK IN PROGRESS**  
> Things a re expected to change.

## Configuration

The app expects a configuration file `config.json`.

### Configuration options

<table>
  <thead>
    <tr>
      <th>JSON path</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required?</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>$.token</code></td>
      <td>String</td>
      <td>Discord Application Bot Token</td>
      <td>Yes ✅</td>
      <td><code>"&lt;YOUR_DISCORD_TOKEN&gt;"</code></td>
    </tr>
    <tr>
      <td><code>$.feeds</code></td>
      <td>Array of Objects</td>
      <td>Rss Feeds to fetch</td>
      <td>Yes ✅<br><small>(Can be empty)</small></td>
      <td rowSpan="4"><pre>
[
  {
    "title": "KSTA",
    "url": "https://feed.ksta.de/feed/rss/region/rhein-erft/index.rss",
    "idKey": "guid"
  }
]
      </pre></td>
    </tr>
    <tr>
      <td><code>$.feeds[:].title</code></td>
      <td>String</td>
      <td>Title of Feed, <br>will be used in Messages.</td>
      <td>Yes ✅</td>
    </tr>
    <tr>
      <td><code>$.feeds[:].url</code></td>
      <td>String (URL)</td>
      <td>Link of Feed</td>
      <td>Yes ✅</td>
    </tr>
    <tr>
      <td><code>$.feeds[:].idKey</code></td>
      <td>String</td>
      <td>Id of items in RSS-Feed,<br>usually <code>id</code> or <code>guid</code></td>
      <td>Yes ✅</td>
    </tr>
    <tr>
      <td><code>$.rssChannels</code></td>
      <td>Array of Strings</td>
      <td>IDs of channels that should receive RSS messages.</td>
      <td>Yes ✅<br><small>(Can be empty)</small></td>
      <td><code>["1234567890987654321"]</code></td>
    </tr>
    <tr>
      <td><code>$.interval</code></td>
      <td>Number (Positive integer)</td>
      <td>Seconds between each fetch of rss feeds.</td>
      <td>No ❌<br><small>Default: <code>600</code></small></td>
      <td><code>2520</code></td>
    </tr>
  </tbody>
</table>