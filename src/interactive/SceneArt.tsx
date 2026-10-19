import type { SceneId } from "../content/scenes";

const window = (x: number, y: number, w = 55, h = 48) => (
  <g key={`${x}-${y}`}>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx="5"
      fill="#dceff4"
      stroke="#77949f"
      strokeWidth="3"
    />
    <path
      d={`M${x + w / 2} ${y}v${h}M${x} ${y + h / 2}h${w}`}
      stroke="#77949f"
      strokeWidth="3"
    />
  </g>
);
export function SceneArt({ scene }: { scene: SceneId }) {
  return (
    <svg
      viewBox="0 0 800 600"
      className={`scene-art scene-art-${scene}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id={`grid-${scene}`}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0H0V40"
            fill="none"
            stroke="#c9d9d0"
            strokeWidth=".7"
            opacity=".4"
          />
        </pattern>
      </defs>
      <rect width="800" height="600" rx="22" fill="#edf4ef" />
      <rect width="800" height="600" fill={`url(#grid-${scene})`} />
      {scene === "body" && (
        <g stroke="#a47053" strokeWidth="3" strokeLinejoin="round">
          <ellipse
            cx="400"
            cy="568"
            rx="162"
            ry="15"
            fill="#d7e5da"
            stroke="none"
          />
          <path
            d="M362 154v30l-55 13-32 85-44 88 30 14 58-91 21-42v102l-15 95 6 96 38 1 20-165h22l20 165 39-1 6-96-15-95V251l21 42 58 91 30-14-44-88-32-85-55-13v-30"
            fill="#dfac87"
          />
          <path
            d="M335 544l-13 15-33 7q-15 15 3 18h62q20-3 13-40M431 544l9 34q7 8 25 6h47q18-3 3-16l-33-9-14-15"
            fill="#dfac87"
          />
          <path
            d="M231 370l-15 23q-2 10 8 8l9-12-4 21q3 10 10 0l7-16 1 17q5 10 9-3l8-28M569 370l15 23q2 10-8 8l-9-12 4 21q-3 10-10 0l-7-16-1 17q-5 10-9-3l-8-28"
            fill="#dfac87"
          />
          <path
            d="M310 195l50-15q40 24 80 0l50 15 21 55-49 21-12-25v100H350V246l-12 25-49-21Z"
            fill="#7da697"
            stroke="#547f71"
          />
          <path
            d="M350 346h100l18 102-39 4-29-76-30 76-40-4Z"
            fill="#6a879c"
            stroke="#4a697d"
          />
          <ellipse cx="343" cy="92" rx="12" ry="20" fill="#dfac87" />
          <ellipse cx="457" cy="92" rx="12" ry="20" fill="#dfac87" />
          <ellipse cx="400" cy="92" rx="55" ry="69" fill="#e5b38f" />
          <path
            d="M346 81q-8-71 59-65 65 0 50 68l-17-32q-44 16-73-3Z"
            fill="#664d41"
            stroke="#664d41"
          />
          <path
            d="M372 78q9-6 17 0M411 78q9-6 17 0M400 88l-5 17h11M380 122q20 14 40 0"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="380" cy="85" r="4" fill="#493d36" />
          <circle cx="420" cy="85" r="4" fill="#493d36" />
        </g>
      )}
      {scene === "house" && (
        <g stroke="#6d8a7b" strokeWidth="3" strokeLinejoin="round">
          <path d="M55 113L400 10l345 103Z" fill="#c7856b" stroke="#9f6e5c" />
          <rect x="70" y="113" width="660" height="416" rx="5" fill="#fffaf1" />
          <path d="M400 113v416M70 295h660" fill="none" strokeWidth="9" />
          <rect
            x="83"
            y="125"
            width="287"
            height="153"
            fill="#e4edf6"
            stroke="none"
          />
          <rect
            x="430"
            y="125"
            width="287"
            height="153"
            fill="#e1eeec"
            stroke="none"
          />
          <rect
            x="83"
            y="315"
            width="287"
            height="197"
            fill="#f4e9dc"
            stroke="none"
          />
          <rect
            x="430"
            y="315"
            width="287"
            height="197"
            fill="#f0ead9"
            stroke="none"
          />
          {window(95, 324, 55, 70)}
          <rect x="89" y="196" width="204" height="61" rx="6" fill="#a0bac8" />
          <path d="M89 174v92M293 213v53" strokeWidth="8" />
          <rect x="98" y="183" width="50" height="26" rx="6" fill="#fff" />
          <path d="M160 202h124v47H160Z" fill="#bfd0e3" stroke="none" />
          <path d="M470 145h84v110h-84Z" fill="#d6e7eb" />
          <path d="M491 154v12h26v14" fill="none" />
          <path
            d="M485 185l-3 27M503 185v31M521 185l4 27"
            stroke="#8dbacb"
            strokeDasharray="4 7"
          />
          <path d="M655 224h50q8 25-16 26v17h-26v-19q-18-6-8-24Z" fill="#fff" />
          <path d="M650 197h50v31h-50Z" fill="#fff" />
          <path
            d="M366 158v133h62M365 291v-22h16v-22h16v-22h16v-22h15"
            fill="#c7b99f"
          />
          <rect
            x="104"
            y="407"
            width="166"
            height="64"
            rx="16"
            fill="#a2bca5"
          />
          <rect
            x="114"
            y="388"
            width="147"
            height="49"
            rx="13"
            fill="#adc8b0"
          />
          <path d="M104 455v25M270 455v25" />
          <path d="M305 381v91m-25 0h50" />
          <path d="M283 348h44l10 42h-64Z" fill="#efd99a" />
          <rect x="642" y="346" width="67" height="131" rx="7" fill="#d6e2e6" />
          <path d="M642 394h67M651 360v23M651 407v34" />
          <rect x="452" y="418" width="175" height="58" fill="#c2b8a1" />
          <rect x="452" y="401" width="175" height="18" fill="#e7dfca" />
          <ellipse cx="594" cy="406" rx="24" ry="6" fill="#8eaaae" />
          <path d="M597 392v-14h15v14" fill="none" />
          <circle cx="493" cy="406" r="11" fill="#545e62" />
          <circle cx="525" cy="406" r="11" fill="#545e62" />
          <rect x="375" y="442" width="50" height="87" fill="#a27d5d" />
          <circle cx="414" cy="487" r="3" fill="#e6d8aa" />
          <path d="M0 543h800" stroke="#a8c4a6" strokeWidth="16" />
          <g fill="#95b69b">
            <circle cx="100" cy="550" r="25" />
            <circle cx="133" cy="546" r="32" />
            <circle cx="172" cy="550" r="23" />
          </g>
        </g>
      )}
      {scene === "car" && (
        <g stroke="#5d7b83" strokeWidth="3" strokeLinejoin="round">
          <rect x="90" y="35" width="620" height="230" rx="38" fill="#dce7e9" />
          <path d="M110 80q270-60 580 0v60H110Z" fill="#8ea9b4" />
          <rect x="133" y="65" width="180" height="47" rx="14" fill="#3c555e" />
          <path
            d="M170 92a38 38 0 0 1 76 0"
            fill="none"
            stroke="#e6e2c9"
            strokeWidth="4"
          />
          <path d="M210 92l15-17" stroke="#d88b6c" />
          <circle
            cx="216"
            cy="135"
            r="56"
            fill="none"
            stroke="#425d62"
            strokeWidth="14"
          />
          <path
            d="M216 143l-43-28M216 143l44-28M216 143v44"
            stroke="#425d62"
            strokeWidth="10"
          />
          <circle cx="216" cy="142" r="16" fill="#425d62" />
          <rect x="360" y="86" width="100" height="57" rx="8" fill="#c3dce1" />
          <path d="M381 113h58M400 99v29" stroke="#789faa" />
          <path d="M409 200v33" strokeWidth="13" />
          <ellipse cx="409" cy="194" rx="13" ry="17" fill="#445f68" />
          <path d="M190 237h25m19 0h25" stroke="#4f6168" strokeWidth="14" />
          <rect x="578" y="74" width="73" height="119" rx="17" fill="#b8c7d2" />
          <path d="M578 82l75 107" stroke="#4b626b" strokeWidth="10" />
          <path
            d="M73 449l18-49 129-15 80-81h194l107 79 97 15 18 51-13 38H81Z"
            fill="#b7cfbe"
          />
          <path
            d="M240 382l71-65h81v65ZM407 317h76l85 65H407Z"
            fill="#cee7ec"
          />
          <path d="M395 390v79M572 396v73" fill="none" />
          <rect x="437" y="411" width="29" height="6" rx="3" fill="#627e75" />
          <ellipse cx="295" cy="384" rx="18" ry="9" fill="#789a8b" />
          <path d="M92 405h38v25H84M676 410h23v25h-23" fill="#f8e6af" />
          <rect x="667" y="460" width="47" height="15" rx="3" fill="#fff" />
          <circle cx="222" cy="488" r="45" fill="#44575e" />
          <circle cx="222" cy="488" r="24" fill="#cad5da" />
          <circle cx="594" cy="488" r="45" fill="#44575e" />
          <circle cx="594" cy="488" r="24" fill="#cad5da" />
          <path d="M83 538h635" stroke="#bbcfbf" strokeWidth="4" />
          <text
            x="400"
            y="287"
            textAnchor="middle"
            fontSize="12"
            fill="#667e75"
            stroke="none"
            letterSpacing="3"
          >
            CONTROLES · EXTERIOR
          </text>
        </g>
      )}
      {scene === "traffic" && (
        <g>
          <rect x="305" width="190" height="600" fill="#7a8b91" />
          <rect y="267" width="800" height="145" fill="#7a8b91" />
          <path
            d="M400 0v240M400 430v170M0 340h280M520 340h280"
            stroke="#e8dcba"
            strokeWidth="4"
            strokeDasharray="25 19"
          />
          <path
            d="M295 0v260H0M505 0v260h295M295 600V422H0M505 600V422h295"
            stroke="#c4cfc8"
            strokeWidth="16"
            fill="none"
          />
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <rect
              key={n}
              x={316 + n * 29}
              y="194"
              width="16"
              height="53"
              fill="#f7f4e8"
            />
          ))}
          <rect
            x="70"
            y="48"
            width="140"
            height="100"
            rx="10"
            fill="#d7e6e9"
            stroke="#7799a5"
            strokeWidth="3"
          />
          <text
            x="140"
            y="117"
            textAnchor="middle"
            fontSize="60"
            fill="#6c8d9e"
          >
            P
          </text>
          <path d="M240 190v66M581 164v90" stroke="#607b74" strokeWidth="7" />
          <path
            d="M224 111h32l23 23v32l-23 23h-32l-23-23v-32Z"
            fill="#b86459"
          />
          <text x="240" y="155" textAnchor="middle" fontSize="17" fill="#fff">
            STOP
          </text>
          <rect x="557" y="75" width="47" height="105" rx="12" fill="#48616a" />
          <circle cx="581" cy="95" r="11" fill="#b46055" />
          <circle cx="581" cy="127" r="11" fill="#d7b773" />
          <circle cx="581" cy="158" r="11" fill="#8caf94" />
          <rect
            x="598"
            y="319"
            width="155"
            height="69"
            rx="14"
            fill="#dbbb80"
            stroke="#a28b66"
            strokeWidth="3"
          />
          <path
            d="M618 332h24v25h-24M653 332h24v25h-24M688 332h24v25h-24"
            fill="#e8f0e7"
          />
          <circle cx="630" cy="388" r="13" fill="#425a63" />
          <circle cx="724" cy="388" r="13" fill="#425a63" />
          <path
            d="M622 270v-79h80v79M609 187h104"
            fill="none"
            stroke="#628c81"
            strokeWidth="7"
          />
          <rect
            x="648"
            y="207"
            width="28"
            height="36"
            fill="#dae9e9"
            stroke="#719b91"
          />
          <circle cx="205" cy="188" r="12" fill="#cb9d7e" />
          <path
            d="M205 203v26m0-17l-15 10m15-10 15 10m-15 7-14 20m14-20 14 20"
            stroke="#526e7a"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <g stroke="#608978" strokeWidth="4" fill="none">
            <circle cx="110" cy="414" r="22" />
            <circle cx="166" cy="414" r="22" />
            <path d="M110 414l26-34 30 34h-56l18-45m8 11h22m8 34-13-44h14" />
          </g>
          <circle
            cx="621"
            cy="468"
            r="29"
            fill="#fbf8ec"
            stroke="#b9685a"
            strokeWidth="8"
          />
          <text
            x="621"
            y="477"
            textAnchor="middle"
            fontSize="24"
            fill="#4d656b"
          >
            30
          </text>
          <path d="M621 501v63" stroke="#6c827a" strokeWidth="5" />
          <path
            d="M372 340h-27l12-12m-12 12 12 12M425 340h27l-12-12m12 12-12 12"
            fill="none"
            stroke="#f7f4e8"
            strokeWidth="5"
          />
        </g>
      )}
      {scene === "restaurant" && (
        <g stroke="#8c8a72" strokeWidth="3">
          <path d="M35 184h730M35 188v45h730v-45" fill="#d7c5a2" />
          <rect x="103" y="74" width="136" height="113" rx="8" fill="#566e61" />
          <text
            x="171"
            y="111"
            textAnchor="middle"
            fill="#f9f3dd"
            stroke="none"
            fontSize="19"
          >
            MENU
          </text>
          <path d="M123 130h94M123 148h65M123 164h79" stroke="#e3dabe" />
          <rect x="55" y="190" width="90" height="52" rx="5" fill="#e9d9bd" />
          <text
            x="100"
            y="223"
            textAnchor="middle"
            fontSize="13"
            stroke="none"
            fill="#786c5a"
          >
            RESERVED
          </text>
          <ellipse cx="620" cy="102" rx="26" ry="31" fill="#dfb08b" />
          <path d="M594 95q-5-45 31-32 27 1 22 31l-15-16Z" fill="#69584a" />
          <path d="M586 146l-16 85h100l-17-85-23-14h-20Z" fill="#fdf9ed" />
          <path d="M610 140h15l-3 35-10 0Z" fill="#6d8f7f" />
          <path
            d="M580 158l-15 39-44-13M658 160l18 39"
            fill="none"
            stroke="#cda17e"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <ellipse cx="509" cy="188" rx="39" ry="7" fill="#d4ddda" />
          <path d="M590 233v47M648 233v47" stroke="#6b7e74" strokeWidth="14" />
          <rect
            x="99"
            y="323"
            width="589"
            height="158"
            rx="28"
            fill="#e5ceb0"
          />
          <path d="M131 481v70M656 481v70" stroke="#a58e70" strokeWidth="11" />
          <rect x="105" y="449" width="96" height="68" rx="12" fill="#96b1a4" />
          <path d="M104 440v81M201 440v81" stroke="#688c7b" strokeWidth="7" />
          <ellipse cx="383" cy="339" rx="76" ry="47" fill="#fdfaf1" />
          <ellipse
            cx="383"
            cy="339"
            rx="58"
            ry="34"
            fill="none"
            stroke="#dbd8c8"
          />
          <path
            d="M269 302v74m-10-74v18q10 14 20 0v-18M472 298v78m0-78q18 23 0 43"
            fill="none"
            stroke="#8a9a98"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <ellipse cx="519" cy="313" rx="11" ry="18" fill="#b5c4bf" />
          <path d="M519 331v43" stroke="#8a9a98" strokeWidth="6" />
          <path d="M464 210l6 50h30l6-50Z" fill="#d6e8e7" />
          <path d="M476 216l2 30h15l2-30" fill="#a6d0d8" stroke="none" />
          <path d="M375 185h35l8 81h-51Z" fill="#c9e0df" />
          <rect x="377" y="171" width="29" height="17" rx="3" fill="#8ba9a3" />
          <path d="M220 386l58-8 16 39-60 9Z" fill="#faf8ee" />
          <path d="M546 380h67v63h-67Z" fill="#fcf9ef" />
          <path d="M556 394h43M556 407h27M556 426h43" stroke="#b4aa91" />
          <rect x="636" y="422" width="50" height="26" rx="5" fill="#cbdfca" />
          <circle cx="662" cy="435" r="8" fill="#abc3ab" />
        </g>
      )}
      {scene === "everyday" && (
        <g stroke="#83968b" strokeWidth="3">
          {[
            [65, 85, "SUPERMARKET", "#eddbc0"],
            [313, 85, "PHARMACY", "#d6e6df"],
            [562, 85, "HOSPITAL", "#e1e8ee"],
            [65, 350, "BANK", "#e1e4d5"],
            [313, 350, "CAFÉ", "#eddbcc"],
          ].map(([x, y, label, color]) => (
            <g key={label}>
              <rect
                x={Number(x)}
                y={Number(y)}
                width="174"
                height="159"
                rx="10"
                fill={String(color)}
              />
              <rect
                x={Number(x) - 7}
                y={Number(y) - 12}
                width="188"
                height="39"
                rx="6"
                fill="#fffaf0"
              />
              <text
                x={Number(x) + 87}
                y={Number(y) + 12}
                textAnchor="middle"
                fontSize="15"
                fill="#4a675a"
                stroke="none"
                fontWeight="600"
              >
                {label}
              </text>
              <rect
                x={Number(x) + 69}
                y={Number(y) + 79}
                width="41"
                height="80"
                rx="4"
                fill="#9db8b5"
              />
              {window(Number(x) + 14, Number(y) + 53, 42, 38)}
              {window(Number(x) + 120, Number(y) + 53, 39, 38)}
            </g>
          ))}
          <path d="M0 270h800v51H0Z" fill="#d9d8c6" stroke="none" />
          <path d="M270 0v600M527 0v600" stroke="#d9d8c6" strokeWidth="21" />
          <path d="M120 217h35v19h-35M88 226h30v10H88" fill="#7e9a8e" />
          <rect x="92" y="445" width="31" height="51" rx="4" fill="#6c8d86" />
          <rect x="99" y="453" width="17" height="13" fill="#d9e7df" />
          <path d="M382 461h29v25h-29Z" fill="#faf8ee" />
          <path d="M412 466q19 0 1 15" fill="none" />
          <path
            d="M627 170v-24h15v24h24v15h-24v24h-15v-24h-24v-15Z"
            fill="#ad776d"
            stroke="none"
          />
          <g fill="#a7c6a7">
            <ellipse cx="645" cy="448" rx="100" ry="64" />
            <circle cx="590" cy="389" r="33" />
            <circle cx="693" cy="386" r="44" />
          </g>
          <path d="M590 390v57M693 388v50" stroke="#9a8869" strokeWidth="8" />
          <ellipse cx="647" cy="496" rx="42" ry="12" fill="#bed5db" />
          <path d="M610 491q37-26 74 0" fill="#d5e3de" />
          <path
            d="M647 487v-23m-15 11q15-29 30 0"
            fill="none"
            stroke="#9ebec7"
            strokeWidth="4"
          />
        </g>
      )}
    </svg>
  );
}
