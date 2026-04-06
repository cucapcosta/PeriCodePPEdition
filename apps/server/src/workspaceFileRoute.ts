import fs from "node:fs";
import http from "node:http";
import path from "node:path";

function isPathWithinProject(projectCwd: string, candidatePath: string): boolean {
  const relative = path.relative(path.resolve(projectCwd), path.resolve(candidatePath));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

export function tryHandleWorkspaceFileRequest(url: URL, res: http.ServerResponse): boolean {
  if (url.pathname !== "/api/workspace-file") {
    return false;
  }

  const cwd = url.searchParams.get("cwd");
  const filePath = url.searchParams.get("path");

  if (!cwd || !filePath) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Missing cwd or path parameter");
    return true;
  }

  const resolved = path.resolve(cwd, filePath);

  if (!isPathWithinProject(cwd, resolved)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Path traversal not allowed");
    return true;
  }

  if (path.extname(resolved).toLowerCase() !== ".html") {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Only .html files are allowed");
    return true;
  }

  fs.readFile(resolved, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("File not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    });
    res.end(data);
  });

  return true;
}
