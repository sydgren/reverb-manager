@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block; text-decoration: none;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
<tr>
{{-- Brand mark: rounded square outline framing a cyan square (mirrors favicon.svg) --}}
<td valign="middle" style="padding-right: 10px; line-height: 0;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border: 2px solid #E6E4DD; border-radius: 7px;">
<tr>
<td style="padding: 5px; font-size: 0; line-height: 0;">
<span style="display: block; width: 12px; height: 12px; background-color: #00C2FF; border-radius: 2px; font-size: 0; line-height: 0;">&nbsp;</span>
</td>
</tr>
</table>
</td>
{{-- Wordmark: "reverberberb" — a pun on reverb echoing (reverb · erb · erb).
     The two trailing "erb" syllables fade out like a decaying echo tail. --}}
<td valign="middle" style="font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 16px; font-weight: 600; letter-spacing: -0.01em;">
<span style="color: #E6E4DD;">reverb</span><span style="color: #8C8A82;">erb</span><span style="color: #57554E;">erb</span>
</td>
</tr>
</table>
</a>
</td>
</tr>
