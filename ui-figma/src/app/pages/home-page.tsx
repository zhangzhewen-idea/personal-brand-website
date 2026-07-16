import { VideoHero } from "../components/video-hero";
import { VideoGrid } from "../components/video-grid";
import { MaterialLibrary } from "../components/material-library";
import { MatrixAccounts } from "../components/matrix-accounts";

export function HomePage() {
  return (
    <div className="w-full">
      <VideoHero />
      <VideoGrid />
      <MaterialLibrary />
      <MatrixAccounts />
    </div>
  );
}
