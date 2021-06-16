/* eslint-disable @typescript-eslint/no-unused-vars */
import { chakra, useToken, HTMLChakraProps } from "@chakra-ui/react";
import * as React from "react";

export const EmptyStateBag = React.forwardRef<
  SVGSVGElement,
  HTMLChakraProps<"svg"> & { colorScheme?: string }
>(({ colorScheme, ...rest }: { colorScheme?: string }, ref) => {
  const [brand50, brand100, brand300, brand500] = useToken(
    "colors",
    ["brand.50", "brand.100", "brand.300", "brand.500"],
    "#ff00ff"
  );
  return (
    <chakra.svg
      width="250"
      height="200"
      fill="none"
      viewBox="0 0 250 200"
      {...rest}
      ref={ref}
    >
      <path
        fill={brand50}
        fillRule="evenodd"
        d="M63 134h91c.515 0 1.017-.056 1.5-.161.483.105.985.161 1.5.161h52a7 7 0 100-14h-6a7 7 0 110-14h19a7 7 0 100-14h-22a7 7 0 100-14h-64a7 7 0 100-14H79a7 7 0 100 14H39a7 7 0 100 14h25a7 7 0 110 14H24a7 7 0 100 14h39a7 7 0 100 14zm163 0a7 7 0 100-14 7 7 0 000 14z"
        clipRule="evenodd"
      />
      <path
        fill={brand100}
        fillRule="evenodd"
        d="M96 66h67l-6 9 8 6H94l9-6-7-9z"
        clipRule="evenodd"
      />
      <path
        fill={brand500}
        d="M197.778 146.355l1.175-.428a1.25 1.25 0 00-2.35 0l1.175.428zm0-1.71l-1.175.428a1.25 1.25 0 002.35 0l-1.175-.428zm-26.028.855c0-.69.56-1.25 1.25-1.25v-2.5a3.75 3.75 0 00-3.75 3.75h2.5zm1.25 1.25c-.69 0-1.25-.56-1.25-1.25h-2.5a3.75 3.75 0 003.75 3.75v-2.5zm22.428 0H173v2.5h22.428v-2.5zm1.175-.823a1.25 1.25 0 01-1.175.823v2.5a3.752 3.752 0 003.525-2.468l-2.35-.855zm3.525.823c-.538 0-1-.341-1.175-.823l-2.35.855a3.75 3.75 0 003.525 2.468v-2.5zm2.872 0h-2.872v2.5H203v-2.5zm1.25-1.25c0 .69-.56 1.25-1.25 1.25v2.5a3.75 3.75 0 003.75-3.75h-2.5zm-1.25-1.25c.69 0 1.25.56 1.25 1.25h2.5a3.75 3.75 0 00-3.75-3.75v2.5zm-2.872 0H203v-2.5h-2.872v2.5zm-1.175.823a1.25 1.25 0 011.175-.823v-2.5a3.75 3.75 0 00-3.525 2.468l2.35.855zm-3.525-.823c.538 0 1 .341 1.175.823l2.35-.855a3.752 3.752 0 00-3.525-2.468v2.5zm-22.428 0h22.428v-2.5H173v2.5zM57.128 143a2.5 2.5 0 00-2.5 2.5h2.5V143zM64 143h-6.872v2.5H64V143zm2.5 2.5A2.5 2.5 0 0064 143v2.5h2.5zM64 148a2.5 2.5 0 002.5-2.5H64v2.5zm-6.872 0H64v-2.5h-6.872v2.5zm-2.5-2.5a2.5 2.5 0 002.5 2.5v-2.5h-2.5zM70 143a2.5 2.5 0 00-2.5 2.5H70V143zm21.454 0H70v2.5h21.454V143zm2.5 2.5a2.5 2.5 0 00-2.5-2.5v2.5h2.5zm-2.5 2.5a2.5 2.5 0 002.5-2.5h-2.5v2.5zM70 148h21.454v-2.5H70v2.5zm-2.5-2.5A2.5 2.5 0 0070 148v-2.5h-2.5z"
      />
      <path
        fill="white"
        fillRule="evenodd"
        d="M93.006 123.215V83c0-1.657 1.36-3 3.037-3h69.479c1.093 0 1.978.895 1.978 2v73c0 2.209-1.771 4-3.955 4H96.961c-2.184 0-3.955-1.791-3.955-4v-19m0-4.103v-4.503 4.503z"
        clipRule="evenodd"
      />
      <path
        fill={brand500}
        d="M91.756 123.215a1.25 1.25 0 002.5 0h-2.5zm2.5 12.785a1.25 1.25 0 00-2.5 0h2.5zm-2.5-4.103a1.25 1.25 0 102.5 0h-2.5zm2.5-4.503a1.25 1.25 0 10-2.5 0h2.5zm0-4.179V83h-2.5v40.215h2.5zm0-40.215c0-.952.786-1.75 1.787-1.75v-2.5c-2.353 0-4.287 1.888-4.287 4.25h2.5zm1.787-1.75h69.479v-2.5H96.043v2.5zm69.479 0a.74.74 0 01.728.75h2.5c0-1.782-1.432-3.25-3.228-3.25v2.5zm.728.75v73h2.5V82h-2.5zm0 73c0 1.532-1.224 2.75-2.705 2.75v2.5c2.888 0 5.205-2.364 5.205-5.25h-2.5zm-2.705 2.75H96.961v2.5h66.584v-2.5zm-66.584 0c-1.48 0-2.705-1.218-2.705-2.75h-2.5c0 2.886 2.317 5.25 5.205 5.25v-2.5zM94.256 155v-14.945h-2.5V155h2.5zm0-14.945V136h-2.5v4.055h2.5zm0-8.158v-4.503h-2.5v4.503h2.5z"
      />
      <path
        stroke={brand500}
        strokeWidth="2.5"
        d="M95 80V68c0-1.105.804-2 1.795-2h66.41c.991 0 1.795.895 1.795 2v12"
      />
      <circle
        cx="113.5"
        cy="97.5"
        r="3.5"
        fill="white"
        stroke={brand500}
        strokeWidth="2.5"
      />
      <circle
        cx="146.5"
        cy="97.5"
        r="3.5"
        fill="white"
        stroke={brand500}
        strokeWidth="2.5"
      />
      <ellipse
        stroke={brand500}
        strokeLinecap="round"
        strokeWidth="2.5"
        rx="16"
        ry="8"
        transform="matrix(1 0 0 -1 130 109)"
      />
      <path
        stroke={brand500}
        strokeLinecap="round"
        strokeWidth="2.5"
        d="M96.061 66.997l7.107 7.015a1 1 0 01-.218 1.587L95 80M164.109 67.07l-6.802 6.937a1 1 0 00.235 1.578L165.636 80"
      />
      <path
        fill={brand300}
        d="M155.166 40.471l-.933-.832.933.832zm-11.099 12.453l-.933-.832.933.832zm.101 1.765l-.831.933.831-.933zm1.765-.101l.933.831-.933-.831zm11.1-12.453l.933.831-.933-.831zm-52.1-1.664l-.933.832.933-.832zm-1.866 1.664l.933-.832-.933.832zm11.099 12.453l-.933.831.933-.831zm1.765.101l.832.933-.832-.933zm.102-1.765l.933-.832-.933.832zM132.5 37a2.5 2.5 0 00-2.5-2.5V37h2.5zm0 16.756V37H130v16.756h2.5zm-2.5 2.5a2.5 2.5 0 002.5-2.5H130v2.5zm-2.5-2.5a2.5 2.5 0 002.5 2.5v-2.5h-2.5zm0-16.756v16.756h2.5V37h-2.5zm2.5-2.5a2.5 2.5 0 00-2.5 2.5h2.5v-2.5zm26.1 6.803l1.663-1.866a2.5 2.5 0 00-3.53.202l1.867 1.664zM145 53.756l11.1-12.453-1.867-1.664-11.099 12.453L145 53.756zm0 0l-1.866-1.664a2.5 2.5 0 00.203 3.53L145 53.756zm0 0l-1.663 1.866a2.5 2.5 0 003.529-.203L145 53.756zm11.1-12.453L145 53.756l1.866 1.663 11.1-12.453-1.866-1.663zm0 0l1.866 1.663a2.5 2.5 0 00-.203-3.53l-1.663 1.867zm-52.1 0l1.866-1.664a2.5 2.5 0 00-3.529-.203L104 41.303zm0 0l-1.663-1.866a2.5 2.5 0 00-.203 3.53L104 41.302zm11.1 12.453L104 41.303l-1.866 1.663 11.099 12.453 1.867-1.663zm0 0l-1.867 1.663a2.5 2.5 0 003.53.203l-1.663-1.866zm0 0l1.663 1.866a2.5 2.5 0 00.203-3.53l-1.866 1.664zM104 41.303l11.1 12.453 1.866-1.664-11.1-12.453L104 41.303z"
      />
    </chakra.svg>
  );
});
