import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Container } from '../components/Container';
import { SeoHead } from '../components/SeoHead';

export const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <SeoHead
        title="404 — AL-ARYAM | الأريام"
        description="الصفحة غير موجودة / Page not found"
      />

      <section className="py-16 lg:py-24 bg-surface min-h-[70vh] flex items-center justify-center">
        <Container className="text-center max-w-[680px]">
          {/* Logo Mark + 404 Visual */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-[120px] h-[66px] mb-6 not-found-mark">
              <svg
                viewBox="0 0 3434 1900"
                fill="none"
                className="w-full h-full text-brand-600"
              >
                <g
                  transform="translate(0.000000,1900.000000) scale(0.100000,-0.100000)"
                  fill="currentColor"
                  stroke="none"
                >
                  <path
                    d="M17181 18640 c-1 -3 431 -1714 958 -3803 l959 -3798 2822 -5132
c1552 -2823 2825 -5135 2829 -5140 4 -4 546 -6 1204 -5 l1196 3 -4970 8915
c-2734 4903 -4977 8926 -4984 8940 -8 14 -14 23 -14 20z M12185 9718 c-2733 -4902 -4975 -8923 -4983 -8936 l-14 -22 1203 2
1203 3 2824 5135 2825 5135 958 3795 c527 2087 957 3796 955 3797 -2 2 -2239
-4007 -4971 -8909z M18980 10400 c0 -3 233 -935 519 -2072 l518 -2066 226 -414 226 -413
-42 -7 c-23 -3 -284 -7 -579 -7 l-538 -1 -14 -22 c-8 -13 -17 -33 -21 -45 l-6
-23 628 0 629 0 1279 -2340 1279 -2340 648 0 c356 0 648 2 648 4 0 4 -5330
9630 -5391 9736 -5 8 -8 13 -9 10z M12684 5572 c-1467 -2649 -2681 -4841 -2697 -4870 l-29 -52 652 2
651 3 1277 2337 1277 2338 625 -3 625 -2 1040 -2182 c572 -1200 1041 -2180
1043 -2178 2 1 -85 414 -194 916 l-197 914 -596 1268 -596 1267 -253 0 -252 0
-22 45 -22 45 -545 1 c-301 1 -558 4 -572 8 -26 6 -25 8 199 416 l225 410 518
2064 c285 1136 517 2066 515 2068 -1 2 -1204 -2165 -2672 -4815z M18162 4067 l-594 -1262 -199 -919 c-109 -506 -197 -921 -196 -923 2
-1 462 959 1022 2135 560 1175 1029 2158 1042 2185 l23 47 -252 0 -253 -1
-593 -1262z M660 564 l0 -205 503 6 c276 3 1699 15 3162 26 2199 16 2662 22 2675
33 12 11 175 15 885 20 479 3 1116 9 1417 12 l548 7 50 90 c27 49 50 91 50 93
0 2 -634 4 -1410 4 -775 0 -1410 2 -1410 4 0 2 12 25 26 50 15 26 25 48 23 50
-2 2 -1470 6 -3261 9 l-3258 6 0 -205z M29423 763 c-1245 -2 -2263 -6 -2263 -11 0 -4 12 -25 25 -47 14 -22
25 -43 25 -47 0 -5 -635 -8 -1411 -8 l-1410 0 43 -78 c24 -42 48 -85 53 -94
10 -16 103 -18 1425 -29 1162 -9 1418 -14 1430 -25 13 -11 478 -17 2680 -33
1466 -11 2889 -23 3163 -26 l497 -6 0 206 0 205 -997 -2 c-549 -2 -2016 -4
-3260 -5z"
                    fillRule="evenodd"
                  />
                </g>
              </svg>
            </div>
            <div className="text-[72px] lg:text-[96px] font-extrabold text-brand-600 leading-none tracking-tight">
              404
            </div>
          </div>

          {/* Bilingual block: Arabic first */}
          <div dir="rtl" className="mb-10 text-center">
            <h1 className="text-h2 text-ink mb-3 font-bold">الصفحة غير موجودة</h1>
            <p className="text-lead text-muted mb-6">
              ربما تم نقل الصفحة أو أن الرابط غير صحيح.
            </p>
            <Link
              to="/ar/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-button bg-brand-600 text-white font-bold text-[15px] hover:bg-brand-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/40"
            >
              العودة إلى الرئيسية
            </Link>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-line mx-auto mb-10" aria-hidden="true" />

          {/* Bilingual block: English below */}
          <div dir="ltr" className="text-center">
            <h2 className="text-h2 text-ink mb-3 font-bold">Page not found</h2>
            <p className="text-lead text-muted mb-6">
              The page may have moved, or the link is incorrect.
            </p>
            <Link
              to="/en/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-button bg-white text-ink border border-line font-bold text-[15px] hover:border-brand-600 hover:text-brand-600 transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/40"
            >
              Back to home
            </Link>
          </div>
        </Container>
      </section>
    </Layout>
  );
};
